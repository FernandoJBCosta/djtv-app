import { Play, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Video } from "@/types/video";

interface HeroProps {
  video: Video;
  onPlay: (video: Video) => void;
}

export function Hero({ video, onPlay }: HeroProps) {
  return (
    <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${video.thumbnail})` }}
      >
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 md:px-8 flex items-center">
        <div className="max-w-2xl animate-fade-up">
          {/* Badge */}
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-primary px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider">
              Featured
            </span>
            {video.rating && (
              <span className="border border-foreground/30 px-2 py-0.5 rounded text-xs font-medium">
                {video.rating}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-shadow mb-4 leading-none">
            {video.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-muted-foreground text-sm mb-6">
            {video.year && <span>{video.year}</span>}
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>{video.duration}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>{video.category}</span>
          </div>

          {/* Description */}
          <p className="text-foreground/80 text-lg max-w-xl mb-8 leading-relaxed">
            {video.description}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button variant="hero" size="xl" onClick={() => onPlay(video)}>
              <Play className="w-5 h-5 fill-current" />
              Play Now
            </Button>
            <Button variant="glass" size="xl">
              <Info className="w-5 h-5" />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
