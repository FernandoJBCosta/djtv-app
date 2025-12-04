import { useRef, useEffect, useState, useCallback } from "react";
import { X, Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Video } from "@/types/video";
import Hls from "hls.js";

interface VideoPlayerProps {
  video: Video;
  onClose: () => void;
}

export function VideoPlayer({ video, onClose }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate video URL based on DJ name
  const getVideoUrl = () => {
    if (video.videoUrl) return video.videoUrl;
    const djSlug = video.title.toLowerCase().replace(/[^a-z0-9]/g, "_");
    return `https://playout.djtv.pt/${djSlug}/index.m3u8`;
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const videoUrl = getVideoUrl();

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
      });
      
      hlsRef.current = hls;
      hls.loadSource(videoUrl);
      hls.attachMedia(videoElement);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        setError(null);
        // On mobile, don't autoplay - let user tap to play
        if (!isMobile) {
          videoElement.play().catch(() => {
            setIsPlaying(false);
          });
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError("Network error - stream unavailable");
              // Retry loading after a delay
              setTimeout(() => {
                hls.startLoad();
              }, 2000);
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setError("Media error - trying to recover");
              hls.recoverMediaError();
              break;
            default:
              setError("Stream not available");
              hls.destroy();
              break;
          }
        }
      });
    } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS support (Safari/iOS)
      videoElement.src = videoUrl;
      
      const handleLoaded = () => {
        setIsLoading(false);
        setError(null);
      };
      
      const handleError = () => {
        setError("Stream not available");
        setIsLoading(false);
      };
      
      videoElement.addEventListener("loadedmetadata", handleLoaded);
      videoElement.addEventListener("error", handleError);
      
      return () => {
        videoElement.removeEventListener("loadedmetadata", handleLoaded);
        videoElement.removeEventListener("error", handleError);
      };
    } else {
      setError("HLS not supported in this browser");
      setIsLoading(false);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [video, isMobile]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleTimeUpdate = () => setCurrentTime(videoElement.currentTime);
    const handleDurationChange = () => setDuration(videoElement.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    videoElement.addEventListener("durationchange", handleDurationChange);
    videoElement.addEventListener("play", handlePlay);
    videoElement.addEventListener("pause", handlePause);
    videoElement.addEventListener("waiting", handleWaiting);
    videoElement.addEventListener("canplay", handleCanPlay);

    return () => {
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      videoElement.removeEventListener("durationchange", handleDurationChange);
      videoElement.removeEventListener("play", handlePlay);
      videoElement.removeEventListener("pause", handlePause);
      videoElement.removeEventListener("waiting", handleWaiting);
      videoElement.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showControls && isPlaying) {
      timeout = setTimeout(() => setShowControls(false), 4000);
    }
    return () => clearTimeout(timeout);
  }, [showControls, isPlaying]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleShowControls = useCallback(() => {
    setShowControls(true);
  }, []);

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {
          // Playback failed
        });
      }
    }
  }, [isPlaying]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      const newVolume = value[0];
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
    }
  };

  const toggleFullscreen = () => {
    const videoElement = videoRef.current;
    const container = containerRef.current;
    
    if (!container || !videoElement) return;

    // iOS Safari requires fullscreen on the video element itself
    if (isMobile && (videoElement as any).webkitEnterFullscreen) {
      if (!isFullscreen) {
        (videoElement as any).webkitEnterFullscreen();
      }
      return;
    }

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }
  };

  const formatTime = (time: number) => {
    if (!isFinite(time) || isNaN(time)) return "0:00";
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleContainerClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // Prevent toggling play when clicking on controls
    if ((e.target as HTMLElement).closest('.video-controls')) {
      return;
    }
    handleShowControls();
    togglePlay();
  }, [handleShowControls, togglePlay]);

  return (
    <div className="fixed inset-0 z-50 bg-black animate-scale-in">
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-sm hover:bg-black/80 text-white w-12 h-12"
        onClick={onClose}
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Video Container */}
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center"
        onMouseMove={handleShowControls}
        onTouchStart={handleShowControls}
        onClick={handleContainerClick}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          poster={video.thumbnail}
          playsInline
          webkit-playsinline="true"
          x5-playsinline="true"
          preload="auto"
        />

        {/* Loading Overlay */}
        {isLoading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 pointer-events-none">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white text-lg">{video.title}</p>
              <p className="text-white/60 text-sm">Loading stream...</p>
            </div>
          </div>
        )}

        {/* Play Button Overlay (for mobile) */}
        {!isPlaying && !isLoading && !error && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/80 flex items-center justify-center">
              <Play className="w-10 h-10 md:w-12 md:h-12 text-white ml-1" />
            </div>
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-center p-8">
              <div
                className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url(${video.thumbnail})` }}
              />
              <h2 className="font-display text-2xl md:text-3xl text-white mb-2">{video.title}</h2>
              <p className="text-white/60 mb-4">{error}</p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                  if (hlsRef.current) {
                    hlsRef.current.startLoad();
                  } else if (videoRef.current) {
                    videoRef.current.load();
                  }
                }}
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Video Controls */}
        <div
          className={`video-controls absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 md:p-4 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {/* Progress Bar */}
          <div className="mb-3 md:mb-4">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="cursor-pointer touch-none"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            {/* Left Controls */}
            <div className="flex items-center gap-2 md:gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={togglePlay} 
                className="text-white hover:bg-white/20 w-10 h-10 md:w-10 md:h-10"
              >
                {isPlaying ? <Pause className="w-5 h-5 md:w-6 md:h-6" /> : <Play className="w-5 h-5 md:w-6 md:h-6" />}
              </Button>

              {/* Volume controls - hide on mobile since they don't work */}
              {!isMobile && (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/20">
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={1}
                    step={0.1}
                    onValueChange={handleVolumeChange}
                    className="w-24"
                  />
                </div>
              )}

              <span className="text-white text-xs md:text-sm whitespace-nowrap">
                {formatTime(currentTime)} / {formatTime(duration || 0)}
              </span>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-1 md:gap-2">
              <span className="text-white text-xs md:text-sm font-display hidden sm:block truncate max-w-[150px]">
                {video.title}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleFullscreen} 
                className="text-white hover:bg-white/20 w-10 h-10"
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
