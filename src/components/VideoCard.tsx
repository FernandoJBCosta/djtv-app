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
      {/* Thumbnail */}
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-card">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-[var(--shadow-glow)] transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-6 h-6 text-primary-foreground fill-current ml-1" />
          </div>
        </div>

        {/* Duration Badge */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-medium">
            {video.duration}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 px-1">
        <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        <p className="text-sm text-muted-foreground truncate mt-1">
          {video.category}
        </p>
      </div>
    </div>
  );
}
