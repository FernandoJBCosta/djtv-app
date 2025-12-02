import { Link } from "react-router-dom";
import { Radio, Disc3, Music2, Waves } from "lucide-react";

export function LiveBanner() {
  return (
    <Link
      to="/live"
      className="block group relative overflow-hidden border-y border-red-500/30 hover:border-red-500/60 transition-all duration-500"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-950/80 via-primary/20 to-red-950/80 animate-pulse" />
      
      {/* Moving gradient overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(239,68,68,0.15)_25%,rgba(239,68,68,0.3)_50%,rgba(239,68,68,0.15)_75%,transparent_100%)] animate-[shimmer_3s_ease-in-out_infinite]" />
      
      {/* Floating icons background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <Disc3 className="absolute left-[10%] top-1/2 -translate-y-1/2 w-8 h-8 text-red-500 animate-spin" style={{ animationDuration: '8s' }} />
        <Music2 className="absolute left-[25%] top-1/2 -translate-y-1/2 w-6 h-6 text-primary animate-bounce" style={{ animationDuration: '2s' }} />
        <Waves className="absolute right-[25%] top-1/2 -translate-y-1/2 w-6 h-6 text-red-500 animate-pulse" />
        <Disc3 className="absolute right-[10%] top-1/2 -translate-y-1/2 w-8 h-8 text-primary animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
      </div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-red-500/10 via-transparent to-red-500/10" />
      
      <div className="container mx-auto px-4 md:px-8 py-5 relative z-10">
        <div className="flex items-center justify-center gap-4 md:gap-6">
          {/* Pulsing Live Indicator */}
          <div className="relative flex items-center gap-2">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]"></span>
            </span>
            <span className="text-red-500 font-bold text-sm md:text-base uppercase tracking-wider drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
              Live Now
            </span>
          </div>
          
          {/* Separator */}
          <div className="h-6 w-px bg-red-500/30 hidden md:block" />
          
          {/* Text */}
          <div className="flex items-center gap-3">
            <Radio className="w-5 h-5 md:w-6 md:h-6 text-red-500 animate-pulse" />
            <span className="font-display text-xl md:text-2xl text-foreground group-hover:text-red-400 transition-colors duration-300 drop-shadow-lg">
              Watch Live DJ Sets
            </span>
          </div>
          
          {/* Arrow with animation */}
          <span className="text-red-500 text-xl font-bold opacity-70 group-hover:opacity-100 translate-x-0 group-hover:translate-x-2 transition-all duration-300">
            →
          </span>
        </div>
      </div>
      
      {/* Sweep effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      
      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
    </Link>
  );
}
