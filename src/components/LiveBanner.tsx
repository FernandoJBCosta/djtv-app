import { Link } from "react-router-dom";
import { Radio } from "lucide-react";

export function LiveBanner() {
  return (
    <Link
      to="/live"
      className="block group relative overflow-hidden bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border-y border-primary/30 hover:border-primary/50 transition-all duration-500"
    >
      <div className="container mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center justify-center gap-4">
          {/* Pulsing Live Indicator */}
          <div className="relative flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-red-500 font-bold text-sm uppercase tracking-wider">Live</span>
          </div>
          
          {/* Text */}
          <div className="flex items-center gap-3">
            <Radio className="w-5 h-5 text-primary group-hover:animate-pulse" />
            <span className="font-display text-lg md:text-xl text-foreground group-hover:text-primary transition-colors duration-300">
              Watch Live DJ Sets Now
            </span>
          </div>
          
          {/* Arrow */}
          <span className="text-primary opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-2 transition-all duration-300">
            →
          </span>
        </div>
      </div>
      
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
    </Link>
  );
}
