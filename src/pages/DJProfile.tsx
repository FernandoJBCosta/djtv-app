import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Pause } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { categories as defaultCategories } from "@/data/djtvData";
import { fetchAndParseXML } from "@/services/xmlParser";
import { Video } from "@/types/video";
import Hls from "hls.js";

const SERVER_XML_URL = "https://app.djtv.pt/content/index.xml";

const DJProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const lastInteractionRef = useRef<number>(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
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

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    videoElement.addEventListener("play", handlePlay);
    videoElement.addEventListener("pause", handlePause);
    videoElement.addEventListener("waiting", handleWaiting);
    videoElement.addEventListener("canplay", handleCanPlay);

    return () => {
      videoElement.removeEventListener("play", handlePlay);
      videoElement.removeEventListener("pause", handlePause);
      videoElement.removeEventListener("waiting", handleWaiting);
      videoElement.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  // Auto-hide play button overlay
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showControls && isPlaying) {
      timeout = setTimeout(() => setShowControls(false), 4000);
    }
    return () => clearTimeout(timeout);
  }, [showControls, isPlaying]);

  const handleShowControls = useCallback(() => {
    setShowControls(true);
  }, []);

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [isPlaying]);

  const handleVideoClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastInteractionRef.current < 300) return;
    lastInteractionRef.current = now;
    handleShowControls();
    togglePlay();
  }, [handleShowControls, togglePlay]);

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
            className="relative aspect-video bg-card rounded-xl overflow-hidden cursor-pointer"
            onMouseMove={handleShowControls}
            onTouchEnd={handleVideoClick}
            onClick={handleVideoClick}
          >
            <video
              ref={videoRef}
              className="w-full h-full object-contain bg-black"
              poster={dj.thumbnail}
              playsInline
              webkit-playsinline="true"
              x5-playsinline="true"
            />

            {/* Loading Overlay */}
            {isLoading && !error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 pointer-events-none">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-white/60 text-sm">Loading stream...</p>
                </div>
              </div>
            )}

            {/* Error Overlay */}
            {error && !isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 pointer-events-none">
                <div className="text-center p-8">
                  <p className="text-white/60 mb-2">{error}</p>
                  <p className="text-white/40 text-sm">Tap to try again</p>
                </div>
              </div>
            )}

            {/* Play/Pause Button Overlay */}
            {!isLoading && !error && (
              <div 
                className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
                  !isPlaying || showControls ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/80 flex items-center justify-center shadow-lg">
                  {isPlaying ? (
                    <Pause className="w-10 h-10 md:w-12 md:h-12 text-white" />
                  ) : (
                    <Play className="w-10 h-10 md:w-12 md:h-12 text-white ml-1" />
                  )}
                </div>
              </div>
            )}
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
