"use client";

import { useState } from "react";
import {
  Clapperboard,
  Coins,
  History,
  ImageIcon,
  Loader2,
  Sparkles,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

import {
  generateMedia,
  getMediaGenerations,
  getMediaUsage,
  purchaseCredits,
} from "@/actions/media";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

const defaultForm = {
  prompt: "",
  mediaType: "image",
};

export default function MediaStudio({ initialUsage, initialGenerations }) {
  const [form, setForm] = useState(defaultForm);
  const [creditsToBuy, setCreditsToBuy] = useState(10);
  const [usage, setUsage] = useState(initialUsage);
  const [generations, setGenerations] = useState(initialGenerations || []);
  const [generating, setGenerating] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  const latestGeneration = generations[0] || null;
  const isRefreshing = false;

  const refreshUsage = async () => {
    const nextUsage = await getMediaUsage();
    setUsage(nextUsage);
  };

  const handleGenerate = async (event) => {
    event.preventDefault();

    if (!form.prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    try {
      setGenerating(true);

      const created = await generateMedia({
        prompt: form.prompt.trim(),
        mediaType: form.mediaType,
      });

      toast.success(
        created.mediaType === "image"
          ? "Image generated successfully"
          : "Video request saved successfully",
      );

      setForm(defaultForm);
      setGenerations((current) => [
        created,
        ...current.filter((item) => item.id !== created.id),
      ]);
      await refreshUsage();
    } catch (error) {
      toast.error(error.message || "Failed to generate media");
    } finally {
      setGenerating(false);
    }
  };

  const handlePurchaseCredits = async () => {
    try {
      setPurchasing(true);
      await purchaseCredits(Number(creditsToBuy));
      toast.success("Credits added successfully");
      await refreshUsage();
    } catch (error) {
      toast.error(error.message || "Failed to add credits");
    } finally {
      setPurchasing(false);
    }
  };

  const hasPrompt = form.prompt.trim().length > 0;

  const hasEnoughCredits =
    form.mediaType === "image"
      ? (usage?.freeImageGenerationsRemaining ?? 0) > 0 ||
        (usage?.creditBalance ?? 0) >= (usage?.imageCreditCost ?? 1)
      : (usage?.creditBalance ?? 0) >= (usage?.videoCreditCost ?? 5);

  const generationBlockedMessage = !hasPrompt
    ? "Enter a prompt to generate media"
    : hasEnoughCredits
      ? ""
      : form.mediaType === "image"
        ? "Free limit reached, please purchase credits"
        : "Insufficient credits to generate video";

  const currentGenerationCost =
    form.mediaType === "image"
      ? usage?.freeImageGenerationsRemaining > 0
        ? "Free while quota remains"
        : `${usage?.imageCreditCost || 1} credit`
      : `${usage?.videoCreditCost || 5} credits`;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Wallet className="h-4 w-4" />
              Credit Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {usage?.creditBalance ?? 0}
            </div>
            <p className="text-sm text-muted-foreground">
              Image costs {usage?.imageCreditCost ?? 1} credit, video costs{" "}
              {usage?.videoCreditCost ?? 5} credits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <ImageIcon className="h-4 w-4" />
              Free Images Left
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {usage?.freeImageGenerationsRemaining ?? 0}
            </div>
            <p className="text-sm text-muted-foreground">
              {usage?.freeImageGenerationsUsed ?? 0} of{" "}
              {usage?.freeImageLimit ?? 3} used
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Coins className="h-4 w-4" />
              Test Purchase
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              type="number"
              min="1"
              value={creditsToBuy}
              onChange={(event) => setCreditsToBuy(event.target.value)}
            />
            <Button
              type="button"
              className="w-full"
              onClick={handlePurchaseCredits}
              disabled={purchasing}
            >
              {purchasing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding Credits...
                </>
              ) : (
                "Add Test Credits"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              AI Media Studio
            </CardTitle>
            <CardDescription>
              Select image or video before generation. This selection is
              mandatory.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="space-y-3">
                <Label>Choose Output Type</Label>
                <RadioGroup
                  value={form.mediaType}
                  onValueChange={(value) =>
                    setForm((current) => ({ ...current, mediaType: value }))
                  }
                  className="grid gap-3 md:grid-cols-2"
                >
                  <Label
                    htmlFor="media-image"
                    className="flex cursor-pointer items-start gap-3 rounded-xl border p-4"
                  >
                    <RadioGroupItem id="media-image" value="image" />
                    <div className="space-y-1">
                      <div className="font-medium">Generate Image</div>
                      <p className="text-sm text-muted-foreground">
                        Use your configured image provider
                      </p>
                    </div>
                  </Label>

                  <Label
                    htmlFor="media-video"
                    className="flex cursor-pointer items-start gap-3 rounded-xl border p-4"
                  >
                    <RadioGroupItem id="media-video" value="video" />
                    <div className="space-y-1">
                      <div className="font-medium">Generate Video</div>
                      <p className="text-sm text-muted-foreground">
                        Use your configured video provider
                      </p>
                    </div>
                  </Label>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  id="prompt"
                  value={form.prompt}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      prompt: event.target.value,
                    }))
                  }
                  className="min-h-36"
                  placeholder={
                    form.mediaType === "image"
                      ? "Example: Create a clean futuristic career coach dashboard on a laptop screen with blue accents"
                      : "Example: Create an 8-second mock startup promo video showing students using an AI career coach platform"
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Current cost: {currentGenerationCost}
                </p>
                {generationBlockedMessage ? (
                  <p className="text-sm text-red-500">
                    {generationBlockedMessage}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center justify-end gap-3">
                {isRefreshing ? (
                  <Badge variant="outline">Refreshing usage...</Badge>
                ) : null}

                <Button
                  type="submit"
                  disabled={generating || !hasPrompt || !hasEnoughCredits}
                >
                  {generating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : form.mediaType === "image" ? (
                    "Generate Image"
                  ) : (
                    "Generate Video"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Result</CardTitle>
            <CardDescription>
              Preview of your most recent generation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!latestGeneration ? (
              <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                Your generated image or video request will appear here.
              </div>
            ) : latestGeneration.mediaType === "image" &&
              latestGeneration.previewUrl ? (
              <div className="space-y-4">
                <img
                  src={latestGeneration.previewUrl}
                  alt={latestGeneration.prompt}
                  className="h-auto w-full rounded-xl border object-cover"
                />
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Badge>Image</Badge>
                    <Badge variant="outline">{latestGeneration.provider}</Badge>
                    {latestGeneration.usedFreeGeneration ? (
                      <Badge variant="secondary">Free</Badge>
                    ) : (
                      <Badge variant="outline">
                        {latestGeneration.creditsUsed} credit
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {latestGeneration.prompt}
                  </p>
                  {latestGeneration.metadata?.note ? (
                    <p className="text-sm text-muted-foreground">
                      {latestGeneration.metadata.note}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : latestGeneration.mediaType === "video" &&
              (latestGeneration.previewUrl || latestGeneration.resultUrl) ? (
              <div className="space-y-4 rounded-xl border p-5">
                <video
                  src={latestGeneration.previewUrl || latestGeneration.resultUrl}
                  controls
                  className="w-full rounded-xl border"
                />
                <div className="flex flex-wrap gap-2">
                  <Badge>Video</Badge>
                  <Badge variant="outline">{latestGeneration.provider}</Badge>
                  <Badge variant="outline">
                    {latestGeneration.creditsUsed} credits
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {latestGeneration.prompt}
                </p>
                <p className="text-sm text-muted-foreground">
                  {latestGeneration.metadata?.note ||
                    "Video generated successfully."}
                </p>
              </div>
            ) : (
              <div className="space-y-4 rounded-xl border p-5">
                <div className="flex flex-wrap gap-2">
                  <Badge>Video</Badge>
                  <Badge variant="outline">{latestGeneration.provider}</Badge>
                  <Badge variant="outline">
                    {latestGeneration.creditsUsed} credits
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Clapperboard className="h-4 w-4" />
                  Mock video request saved
                </div>
                <p className="text-sm text-muted-foreground">
                  {latestGeneration.prompt}
                </p>
                <p className="text-sm text-muted-foreground">
                  {latestGeneration.metadata?.note ||
                    "Replace mock handling with a real video provider later."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Generation History
          </CardTitle>
          <CardDescription>
            All generated media is saved here with usage details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!generations.length ? (
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              No generations yet. Create your first image or video request.
            </div>
          ) : (
            <div className="space-y-4">
              {generations.map((item) => (
                <div key={item.id} className="rounded-xl border p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <Badge>
                          {item.mediaType === "image" ? "Image" : "Video"}
                        </Badge>
                        <Badge variant="outline">{item.provider}</Badge>
                        <Badge variant="outline">{item.status}</Badge>
                        {item.usedFreeGeneration ? (
                          <Badge variant="secondary">Free usage</Badge>
                        ) : (
                          <Badge variant="outline">
                            {item.creditsUsed} credits used
                          </Badge>
                        )}
                      </div>

                      <p className="font-medium">{item.prompt}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="w-full md:w-56">
                      {item.mediaType === "image" && item.previewUrl ? (
                        <img
                          src={item.previewUrl}
                          alt={item.prompt}
                          className="h-auto w-full rounded-lg border object-cover"
                        />
                      ) : item.mediaType === "video" &&
                        (item.previewUrl || item.resultUrl) ? (
                        <video
                          src={item.previewUrl || item.resultUrl}
                          controls
                          className="w-full rounded-lg border"
                        />
                      ) : (
                        <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                          {item.metadata?.note || "Mock video entry saved"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
