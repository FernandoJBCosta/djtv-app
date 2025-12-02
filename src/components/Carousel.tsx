import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { CarouselItem } from "@/types/video";

interface CarouselProps {
  items: CarouselItem[];
}

export function Carousel({ items }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [items.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handleBannerClick = (item: CarouselItem) => {
    if (item.videoId) {
      navigate(`/dj/${item.videoId}`);
    }
  };

  if (items.length === 0) return null;

  return (
    <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden group">
      {/* Background Images */}
      {items.map((item, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          } ${item.videoId ? "cursor-pointer" : ""}`}
          onClick={() => index === currentIndex && handleBannerClick(item)}
        >
          <img
            src={item.src}
            alt={`Carousel ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        </div>
      ))}

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 hover:bg-background/70"
        onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
      >
        <ChevronLeft className="w-8 h-8" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 hover:bg-background/70"
        onClick={(e) => { e.stopPropagation(); goToNext(); }}
      >
        <ChevronRight className="w-8 h-8" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {items.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-primary w-8"
                : "bg-foreground/50 hover:bg-foreground/70"
            }`}
            onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
          />
        ))}
      </div>
    </section>
  );
}
