import { useRef, useEffect, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Radio } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import Hls from "hls.js";

const LIVE_STREAM_URL = "https://playout.djtv.pt/djtv/index.m3u8";

const Live = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        liveSyncDuration: 3,
        liveMaxLatencyDuration: 10,
      });

      hlsRef.current = hls;
      hls.loadSource(LIVE_STREAM_URL);
      hls.attachMedia(videoElement);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        setIsLive(true);
        videoElement.play().catch(() => {
          setIsPlaying(false);
        });
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError("Stream currently offline");
              setIsLive(false);
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              setError("Stream unavailable");
              setIsLive(false);
              break;
          }
        }
      });
    } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
      videoElement.src = LIVE_STREAM_URL;
      videoElement.addEventListener("loadedmetadata", () => {
        setIsLoading(false);
        videoElement.play();
      });
    } else {
      setError("HLS not supported");
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    videoElement.addEventListener("play", handlePlay);
    videoElement.addEventListener("pause", handlePause);

    return () => {
      videoElement.removeEventListener("play", handlePlay);
      videoElement.removeEventListener("pause", handlePause);
    };
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showControls && isPlaying) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls, isPlaying]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

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

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* Live Badge Header */}
        <div className="container mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 bg-destructive px-3 py-1.5 rounded-full animate-pulse">
              <Radio className="w-4 h-4" />
              <span className="text-sm font-semibold uppercase tracking-wider">Live</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl">DJTV Live</h1>
          </div>

          {/* Video Player */}
          <div
            ref={containerRef}
            className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl"
            onMouseMove={() => setShowControls(true)}
          >
            <video
              ref={videoRef}
              className="w-full h-full object-contain cursor-pointer"
              playsInline
              onClick={togglePlay}
            />

            {/* Loading Overlay */}
            {isLoading && !error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-white text-lg">Connecting to live stream...</p>
                </div>
              </div>
            )}

            {/* Error/Offline Overlay */}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-card to-background">
                <div className="text-center p-8">
                  <Radio className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h2 className="font-display text-2xl text-foreground mb-2">Stream Offline</h2>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <p className="text-muted-foreground/60 text-sm">Check back later for live content</p>
                </div>
              </div>
            )}

            {/* Live Indicator */}
            {isLive && !error && !isLoading && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-destructive/90 backdrop-blur-sm px-3 py-1 rounded">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-sm font-semibold">LIVE</span>
              </div>
            )}

            {/* Video Controls */}
            <div
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300 ${
                showControls ? "opacity-100" : "opacity-0"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20"
                    >
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
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-white/80 text-sm font-display">DJTV Live</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleFullscreen}
                    className="text-white hover:bg-white/20"
                  >
                    {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Stream Info */}
          <div className="mt-6 p-6 bg-card rounded-xl">
            <h2 className="font-display text-xl mb-2">About DJTV Live</h2>
            <p className="text-muted-foreground">
              Watch the best DJ performances 24/7. DJTV brings you live sets from top artists and
              underground talents from around the world.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Live;
