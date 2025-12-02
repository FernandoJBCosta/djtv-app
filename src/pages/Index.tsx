import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ContentRow } from "@/components/ContentRow";
import { VideoPlayer } from "@/components/VideoPlayer";
import { featuredVideo, categories } from "@/data/mockVideos";
import { Video } from "@/types/video";

const Index = () => {
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

  const handlePlay = (video: Video) => {
    setCurrentVideo(video);
  };

  const handleClose = () => {
    setCurrentVideo(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <Hero video={featuredVideo} onPlay={handlePlay} />
        
        <div className="-mt-32 relative z-10 pb-20">
          {categories.map((category) => (
            <ContentRow
              key={category.id}
              category={category}
              onPlay={handlePlay}
            />
          ))}
        </div>
      </main>

      {/* Video Player Modal */}
      {currentVideo && (
        <VideoPlayer video={currentVideo} onClose={handleClose} />
      )}
    </div>
  );
};

export default Index;
