import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Video } from "@/types/video";

interface VideoPlayerProps {
  video: Video;
  onClose: () => void;
}

export function VideoPlayer({ video, onClose }: VideoPlayerProps) {
  return (
    <div className="fixed inset-0 z-50 bg-background animate-scale-in">
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10 bg-background/50 backdrop-blur-sm hover:bg-background/80"
        onClick={onClose}
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Video Container */}
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full max-w-6xl aspect-video bg-card rounded-lg overflow-hidden shadow-2xl">
          {/* Placeholder - in production, use a proper video player like HLS.js */}
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-card to-background">
            <div
              className="w-full h-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${video.thumbnail})` }}
            >
              <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center">
                <div className="text-center p-8">
                  <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
                    {video.title}
                  </h2>
                  <p className="text-muted-foreground mb-6 max-w-lg">
                    {video.description}
                  </p>
                  <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6 inline-block">
                    <p className="text-sm text-muted-foreground mb-2">Stream URL:</p>
                    <code className="text-xs md:text-sm text-primary break-all">
                      {video.videoUrl}
                    </code>
                  </div>
                  <p className="text-sm text-muted-foreground mt-6">
                    Connect your video player to stream content from your Flussonic server
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
