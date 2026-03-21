import { getMediaGenerations, getMediaUsage } from "@/actions/media";
import MediaStudio from "./media-studio";

export default async function AiMediaPage() {
  const [usage, generations] = await Promise.all([
    getMediaUsage(),
    getMediaGenerations(),
  ]);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 space-y-2">
        <h1 className="text-5xl font-bold gradient-title">AI Media Studio</h1>
        <p className="text-muted-foreground">
          Generate images or videos, track free usage, and manage credits.
        </p>
      </div>

      <MediaStudio
        initialUsage={usage}
        initialGenerations={generations}
      />
    </div>
  );
}
