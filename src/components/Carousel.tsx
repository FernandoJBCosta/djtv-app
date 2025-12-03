import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Radio, Disc3 } from "lucide-react";
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
    if (item.isLive) {
      navigate("/live", { state: { videoUrl: item.videoUrl, title: item.title } });
    } else if (item.videoUrl) {
      navigate("/video", { state: { videoUrl: item.videoUrl, title: item.title || "Featured Video" } });
    } else if (item.videoId) {
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
          } ${item.videoUrl || item.videoId || item.isLive ? "cursor-pointer" : ""}`}
          onClick={() => index === currentIndex && handleBannerClick(item)}
        >
          <img
            src={item.src}
            alt={`Carousel ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
          
          {/* Video Banner Overlay - shows title and "Watch Now" on hover */}
          {(item.videoUrl || item.videoId) && !item.isLive && index === currentIndex && (
            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-300 flex items-center justify-center group/banner">
              {/* Title always visible at bottom */}
              {item.title && (
                <div className="absolute bottom-16 left-8 right-8">
                  <h2 className="font-display text-3xl md:text-5xl text-foreground drop-shadow-lg">{item.title}</h2>
                </div>
              )}
              {/* Play button on hover */}
              <div className="flex flex-col items-center gap-3 opacity-0 group-hover/banner:opacity-100 transform translate-y-4 group-hover/banner:translate-y-0 transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-lg shadow-primary/30">
                  <svg className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <span className="font-display text-2xl text-foreground drop-shadow-lg">WATCH NOW</span>
              </div>
            </div>
          )}
          
          {/* Live Overlay */}
          {item.isLive && (
            <>
              {/* Red gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-950/70 via-red-900/40 to-red-950/70" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              
              {/* Animated pulse effect */}
              <div className="absolute inset-0 bg-red-500/10 animate-pulse" />
              
              {/* Floating icons */}
              <div className="absolute inset-0 overflow-hidden">
                <Disc3 className="absolute left-[5%] top-[30%] w-16 h-16 text-red-500/30 animate-spin" style={{ animationDuration: '10s' }} />
                <Disc3 className="absolute right-[5%] top-[40%] w-20 h-20 text-primary/20 animate-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }} />
                <Disc3 className="absolute left-[15%] bottom-[30%] w-12 h-12 text-red-500/20 animate-spin" style={{ animationDuration: '12s' }} />
                <Disc3 className="absolute right-[15%] bottom-[25%] w-14 h-14 text-primary/25 animate-spin" style={{ animationDuration: '9s', animationDirection: 'reverse' }} />
              </div>
              
              {/* Live content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                {/* Live indicator */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]"></span>
                  </span>
                  <span className="text-red-500 font-bold text-lg uppercase tracking-wider drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]">
                    Live Now
                  </span>
                </div>
                
                {/* Title */}
                <div className="flex items-center gap-4 mb-6">
                  <Radio className="w-10 h-10 text-red-500 animate-pulse" />
                  <h2 className="font-display text-4xl md:text-6xl lg:text-7xl text-foreground drop-shadow-lg">
                    {item.title || "WATCH LIVE DJ SETS"}
                  </h2>
                  <Radio className="w-10 h-10 text-red-500 animate-pulse" />
                </div>
                
                {/* CTA */}
                <div className="flex items-center gap-2 text-foreground/80 text-lg">
                  <span>Click to watch</span>
                  <span className="text-red-500 animate-bounce">→</span>
                </div>
              </div>
              
              {/* Glow lines */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
            </>
          )}
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
        {items.map((item, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? item.isLive 
                  ? "bg-red-500 w-8 shadow-[0_0_10px_rgba(239,68,68,0.6)]"
                  : "bg-primary w-8"
                : "bg-foreground/50 hover:bg-foreground/70"
            }`}
            onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
          />
        ))}
      </div>
    </section>
  );
}
