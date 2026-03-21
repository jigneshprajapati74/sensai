import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function checkUser() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const email = user.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error("No email found for authenticated user");
  }

  const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();

  try {
    return await db.user.upsert({
      where: {
        clerkUserId: user.id,
      },
      update: {
        email,
        name: name || "User",
        imageUrl: user.imageUrl,
      },
      create: {
        clerkUserId: user.id,
        email,
        name: name || "User",
        imageUrl: user.imageUrl,
      },
    });
  } catch (error) {
    console.error("Failed to sync user record", error);
    return null;
  }
}
