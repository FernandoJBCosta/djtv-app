import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Video } from "@/types/video";
import { cn } from "@/lib/utils";

interface VideoCardProps {
  video: Video;
  onPlay?: (video: Video) => void;
  className?: string;
}

export function VideoCard({ video, onPlay, className }: VideoCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onPlay) {
      onPlay(video);
    } else {
      navigate(`/dj/${video.id}`);
    }
  };

  return (
    <div
      className={cn(
        "group relative flex-shrink-0 w-[180px] sm:w-[200px] md:w-[220px] cursor-pointer",
        className
      )}
      onClick={handleClick}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-card transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] group-hover:-translate-y-2">
        {/* Image */}
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
        
        {/* Glow Border Effect */}
        <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary/50 transition-all duration-500" />
        
        {/* Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%]" style={{ transition: 'transform 0.7s ease-out, opacity 0.3s ease-out' }} />
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)] transform scale-0 group-hover:scale-100 transition-all duration-500 ease-out">
            <Play className="w-7 h-7 text-primary-foreground fill-current ml-1" />
          </div>
        </div>

        {/* Duration Badge */}
        {video.duration && (
          <div className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-semibold shadow-lg">
            {video.duration}
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-semibold text-primary-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
          {video.category}
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 px-1">
        <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-300">
          {video.title}
        </h3>
        <p className="text-sm text-muted-foreground truncate mt-1 group-hover:text-muted-foreground/80 transition-colors duration-300">
          {video.category}
        </p>
      </div>
    </div>
  );
}
