import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { categories as defaultCategories } from "@/data/djtvData";
import { fetchAndParseXML } from "@/services/xmlParser";
import { Video, Category } from "@/types/video";
import Hls from "hls.js";

const SERVER_XML_URL = "https://app.djtv.pt/content/index.xml";

const DJProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
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
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dj, setDj] = useState<Video | undefined>(undefined);

  // Fetch data from server XML
  useEffect(() => {
    const loadData = async () => {
      try {
        const url = `${SERVER_XML_URL}?t=${Date.now()}`;
        const data = await fetchAndParseXML(url);
        const foundDj = data.categories
          .flatMap(cat => cat.videos)
          .find(video => video.id === id);
        setDj(foundDj);
      } catch (error) {
        // Fallback to default data
        const foundDj = defaultCategories
          .flatMap(cat => cat.videos)
          .find(video => video.id === id);
        setDj(foundDj);
      } finally {
        setIsDataLoading(false);
      }
    };
    loadData();
  }, [id]);

  useEffect(() => {
    if (!dj || !videoRef.current) return;
    
    const videoElement = videoRef.current;
    const videoUrl = dj.videoUrl;

    if (!videoUrl) {
      setError("No video URL available");
      setIsLoading(false);
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      
      hlsRef.current = hls;
      hls.loadSource(videoUrl);
      hls.attachMedia(videoElement);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError("Network error - stream unavailable");
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              setError("Stream not available");
              hls.destroy();
              break;
          }
          setIsLoading(false);
        }
      });
    } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
      videoElement.src = videoUrl;
      videoElement.addEventListener("loadedmetadata", () => {
        setIsLoading(false);
      });
    } else {
      setError("HLS not supported in this browser");
      setIsLoading(false);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [dj]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleTimeUpdate = () => setCurrentTime(videoElement.currentTime);
    const handleDurationChange = () => setDuration(videoElement.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    videoElement.addEventListener("durationchange", handleDurationChange);
    videoElement.addEventListener("play", handlePlay);
    videoElement.addEventListener("pause", handlePause);

    return () => {
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      videoElement.removeEventListener("durationchange", handleDurationChange);
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

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
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

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 container mx-auto px-4 md:px-8 py-8">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!dj) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 container mx-auto px-4 md:px-8 py-8">
          <div className="text-center">
            <h1 className="font-display text-4xl mb-4">DJ Not Found</h1>
            <p className="text-muted-foreground mb-4">The video ID "{id}" was not found.</p>
            <Button onClick={() => navigate("/categories")}>
              Back to Categories
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Back Button */}
        <div className="container mx-auto px-4 md:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        {/* Video Player Section */}
        <div className="container mx-auto px-4 md:px-8">
          <div
            ref={containerRef}
            className="relative aspect-video bg-card rounded-xl overflow-hidden"
            onMouseMove={() => setShowControls(true)}
          >
            <video
              ref={videoRef}
              className="w-full h-full object-contain bg-black"
              poster={dj.thumbnail}
              playsInline
              onClick={togglePlay}
            />

            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-white/60 text-sm">Loading stream...</p>
                </div>
              </div>
            )}

            {/* Error Overlay */}
            {error && !isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <div className="text-center p-8">
                  <p className="text-white/60 mb-2">{error}</p>
                  <p className="text-white/40 text-sm">Click play to try again</p>
                </div>
              </div>
            )}

            {/* Play Button Overlay */}
            {!isPlaying && !isLoading && (
              <div
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                onClick={togglePlay}
              >
                <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-[var(--shadow-glow)] transition-transform hover:scale-110">
                  <Play className="w-10 h-10 text-primary-foreground fill-current ml-1" />
                </div>
              </div>
            )}

            {/* Video Controls */}
            <div
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300 ${
                showControls ? "opacity-100" : "opacity-0"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Progress Bar */}
              <div className="mb-4">
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={1}
                  onValueChange={handleSeek}
                  className="cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                {/* Left Controls */}
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white hover:bg-white/20">
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </Button>

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

                  <span className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration || 0)}
                  </span>
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
                    {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DJ Info Section */}
        <div className="container mx-auto px-4 md:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* DJ Image */}
            <div className="w-48 h-48 rounded-xl overflow-hidden bg-card flex-shrink-0">
              <img
                src={dj.thumbnail}
                alt={dj.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* DJ Details */}
            <div className="flex-1">
              <h1 className="font-display text-4xl md:text-5xl mb-3">{dj.title}</h1>
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium">
                  {dj.category}
                </span>
                {dj.year && (
                  <span className="text-muted-foreground">{dj.year}</span>
                )}
                {dj.rating && (
                  <span className="text-muted-foreground">★ {dj.rating}</span>
                )}
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                {dj.description}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DJProfile;
