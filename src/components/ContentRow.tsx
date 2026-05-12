import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { VideoCard } from "./VideoCard";
import { Category, Video } from "@/types/video";

interface ContentRowProps {
  category: Category;
  onPlay?: (video: Video) => void;
}

export function ContentRow({ category, onPlay }: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative py-6">
      {/* Header */}
      <div className="container mx-auto px-4 md:px-8 mb-4">
        <h2 className="font-display text-2xl md:text-3xl text-foreground">
          {category.name}
        </h2>
      </div>

      {/* Scroll Container */}
      <div className="relative group/row">
        {/* Left Arrow */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-full rounded-none bg-gradient-to-r from-background/80 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity [@media(hover:none)]:hidden"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>

        {/* Cards */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-4 md:px-8 pb-4"
        >
          {category.videos.map((video, index) => (
            <VideoCard key={video.id} video={video} onPlay={onPlay} index={index} />
          ))}
        </div>

        {/* Right Arrow */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-full rounded-none bg-gradient-to-l from-background/80 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity [@media(hover:none)]:hidden"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="w-8 h-8" />
        </Button>
      </div>
    </section>
  );
}
