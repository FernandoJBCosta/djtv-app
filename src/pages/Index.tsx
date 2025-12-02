import { useState } from "react";
import { Header } from "@/components/Header";
import { Carousel } from "@/components/Carousel";
import { ContentRow } from "@/components/ContentRow";
import { VideoPlayer } from "@/components/VideoPlayer";
import { carouselItems, categories } from "@/data/djtvData";
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
        <Carousel items={carouselItems} />
        
        <div className="relative z-10 pb-20">
          {categories.map((category) => (
            <ContentRow
              key={category.id}
              category={category}
              onPlay={handlePlay}
            />
          ))}
        </div>
      </main>

      {currentVideo && (
        <VideoPlayer video={currentVideo} onClose={handleClose} />
      )}
    </div>
  );
};

export default Index;
