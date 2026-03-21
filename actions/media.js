"use server";

import { auth } from "@clerk/nextjs/server";
import { ZodError } from "zod";

import { mediaGenerationSchema } from "@/app/lib/schema";
import { db } from "@/lib/db";

const FREE_IMAGE_LIMIT = 3;
const IMAGE_CREDIT_COST = 1;
const VIDEO_CREDIT_COST = 5;

// ✅ Free-tier Replicate models (replicate.com/collections/try-for-free)
const REPLICATE_IMAGE_MODEL = "black-forest-labs/flux-dev";  // Free tier image
const REPLICATE_VIDEO_MODEL = "minimax/video-01";            // Free tier video

function getReadableError(error, fallback = "Something went wrong") {
  if (error instanceof ZodError) {
    return error.issues[0]?.message || fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

async function getCurrentDbUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      id: true,
      creditBalance: true,
      freeImageGenerationsUsed: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

function getUsageDecision(user, mediaType) {
  if (mediaType === "image" && user.freeImageGenerationsUsed < FREE_IMAGE_LIMIT) {
    return {
      creditsNeeded: 0,
      useFreeGeneration: true,
    };
  }

  const creditsNeeded =
    mediaType === "image" ? IMAGE_CREDIT_COST : VIDEO_CREDIT_COST;

  if (user.creditBalance < creditsNeeded) {
    if (mediaType === "image") {
      throw new Error("Free limit reached, please purchase credits");
    }
    throw new Error("Insufficient credits to generate video");
  }

  return {
    creditsNeeded,
    useFreeGeneration: false,
  };
}

/**
 * Poll a Replicate prediction until it succeeds or fails.
 * Replicate is async by default — status: starting → processing → succeeded/failed
 */
async function pollReplicatePrediction(predictionId, maxWaitMs = 120_000) {
  const pollInterval = 3000;
  const start = Date.now();

  while (Date.now() - start < maxWaitMs) {
    await new Promise((resolve) => setTimeout(resolve, pollInterval));

    const response = await fetch(
      `https://api.replicate.com/v1/predictions/${predictionId}`,
      {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err?.detail || "Failed to poll Replicate prediction");
    }

    const prediction = await response.json();

    if (prediction.status === "succeeded") {
      return prediction;
    }

    if (prediction.status === "failed" || prediction.status === "canceled") {
      throw new Error(
        prediction.error || `Replicate prediction ${prediction.status}`,
      );
    }

    // "starting" or "processing" — keep polling
  }

  throw new Error("Replicate prediction timed out");
}

/**
 * IMAGE: black-forest-labs/flux-dev (Replicate free tier)
 * Official model endpoint — no version hash required.
 * Output: array of webp image URLs
 */
async function generateImageWithReplicate(prompt) {
  if (!process.env.REPLICATE_API_KEY) {
    throw new Error("REPLICATE_API_KEY is missing from environment variables");
  }

  const createResponse = await fetch(
    `https://api.replicate.com/v1/models/${REPLICATE_IMAGE_MODEL}/predictions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
        Prefer: "wait=60",
      },
      body: JSON.stringify({
        input: {
          prompt,
          num_outputs: 1,
          aspect_ratio: "1:1",
          output_format: "webp",
          output_quality: 80,
          guidance: 3.5,
          num_inference_steps: 28,
          disable_safety_checker: false,
        },
      }),
      cache: "no-store",
    },
  );

  const prediction = await createResponse.json();

  if (!createResponse.ok) {
    throw new Error(
      prediction?.detail || prediction?.error || "Failed to create image prediction on Replicate",
    );
  }

  // If Prefer: wait returned succeeded immediately, use it; else poll
  let result = prediction;
  if (result.status !== "succeeded") {
    result = await pollReplicatePrediction(prediction.id, 120_000);
  }

  const outputUrl = Array.isArray(result.output)
    ? result.output[0]
    : result.output;

  if (!outputUrl) {
    throw new Error("Replicate flux-dev did not return an image URL");
  }

  return {
    provider: "replicate",
    resultUrl: outputUrl,
    previewUrl: outputUrl,
    metadata: {
      model: REPLICATE_IMAGE_MODEL,
      predictionId: result.id,
    },
  };
}

/**
 * VIDEO: minimax/video-01 (Replicate free tier)
 * Official model endpoint — no version hash required.
 * Output: a single mp4 video URL
 */
async function generateVideoWithReplicate(prompt) {
  if (!process.env.REPLICATE_API_KEY) {
    throw new Error("REPLICATE_API_KEY is missing from environment variables");
  }

  const createResponse = await fetch(
    `https://api.replicate.com/v1/models/${REPLICATE_VIDEO_MODEL}/predictions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
        Prefer: "wait=60",
      },
      body: JSON.stringify({
        input: {
          prompt,
          prompt_optimizer: true, // minimax built-in prompt enhancer
        },
      }),
      cache: "no-store",
    },
  );

  const prediction = await createResponse.json();

  if (!createResponse.ok) {
    throw new Error(
      prediction?.detail || prediction?.error || "Failed to create video prediction on Replicate",
    );
  }

  let result = prediction;
  if (result.status !== "succeeded") {
    // Videos take longer — poll up to 5 minutes
    result = await pollReplicatePrediction(prediction.id, 300_000);
  }

  const outputUrl = Array.isArray(result.output)
    ? result.output[0]
    : result.output;

  if (!outputUrl) {
    throw new Error("Replicate minimax/video-01 did not return a video URL");
  }

  return {
    provider: "replicate",
    resultUrl: outputUrl,
    previewUrl: outputUrl,
    metadata: {
      model: REPLICATE_VIDEO_MODEL,
      predictionId: result.id,
    },
  };
}

export async function generateMedia(input) {
  try {
    const parsedData = mediaGenerationSchema.parse(input);
    const prompt = parsedData.prompt.trim();
    const mediaType = parsedData.mediaType;

    const user = await getCurrentDbUser();

    // Early validation before calling any provider
    getUsageDecision(user, mediaType);

    const generatedResult =
      mediaType === "image"
        ? await generateImageWithReplicate(prompt)
        : await generateVideoWithReplicate(prompt);

    const savedGeneration = await db.$transaction(async (tx) => {
      const freshUser = await tx.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          creditBalance: true,
          freeImageGenerationsUsed: true,
        },
      });

      if (!freshUser) {
        throw new Error("User not found");
      }

      const usageDecision = getUsageDecision(freshUser, mediaType);

      if (usageDecision.useFreeGeneration) {
        await tx.user.update({
          where: { id: user.id },
          data: {
            freeImageGenerationsUsed: {
              increment: 1,
            },
          },
        });
      } else if (usageDecision.creditsNeeded > 0) {
        await tx.user.update({
          where: { id: user.id },
          data: {
            creditBalance: {
              decrement: usageDecision.creditsNeeded,
            },
          },
        });

        await tx.creditTransaction.create({
          data: {
            userId: user.id,
            type:
              mediaType === "image" ? "image_generation" : "video_generation",
            credits: -usageDecision.creditsNeeded,
            description: `Used ${usageDecision.creditsNeeded} credits for ${mediaType} generation`,
          },
        });
      }

      return tx.mediaGeneration.create({
        data: {
          userId: user.id,
          prompt,
          mediaType,
          provider: generatedResult.provider,
          status: "completed",
          resultUrl: generatedResult.resultUrl,
          previewUrl: generatedResult.previewUrl,
          creditsUsed: usageDecision.creditsNeeded,
          usedFreeGeneration: usageDecision.useFreeGeneration,
          metadata: generatedResult.metadata,
        },
      });
    });

    return savedGeneration;
  } catch (error) {
    throw new Error(getReadableError(error, "Failed to generate media"));
  }
}

export async function getMediaGenerations() {
  const user = await getCurrentDbUser();

  return db.mediaGeneration.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getMediaUsage() {
  const user = await getCurrentDbUser();

  return {
    creditBalance: user.creditBalance,
    freeImageGenerationsUsed: user.freeImageGenerationsUsed,
    freeImageLimit: FREE_IMAGE_LIMIT,
    freeImageGenerationsRemaining: Math.max(
      0,
      FREE_IMAGE_LIMIT - user.freeImageGenerationsUsed,
    ),
    imageCreditCost: IMAGE_CREDIT_COST,
    videoCreditCost: VIDEO_CREDIT_COST,
  };
}

export async function purchaseCredits(credits = 10) {
  try {
    const user = await getCurrentDbUser();
    const numericCredits = Number(credits);

    if (!Number.isInteger(numericCredits) || numericCredits <= 0) {
      throw new Error("Please enter a valid credit amount");
    }

    const updatedUser = await db.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: {
          creditBalance: {
            increment: numericCredits,
          },
        },
      });

      await tx.creditTransaction.create({
        data: {
          userId: user.id,
          type: "purchase",
          credits: numericCredits,
          description: `Test credit purchase for ${numericCredits} credits`,
        },
      });

      return tx.user.findUnique({
        where: { id: user.id },
        select: {
          creditBalance: true,
          freeImageGenerationsUsed: true,
        },
      });
    });

    return updatedUser;
  } catch (error) {
    throw new Error(getReadableError(error, "Failed to purchase credits"));
  }
}