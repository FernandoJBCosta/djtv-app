import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Carousel } from "@/components/Carousel";
import { ContentRow } from "@/components/ContentRow";
import { LiveBanner } from "@/components/LiveBanner";
import { VideoCardSkeletonRow } from "@/components/VideoCardSkeleton";
import { carouselItems, categories } from "@/data/djtvData";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <Carousel items={carouselItems} />
        
        <LiveBanner />
        
        <div className="relative z-10 pb-20">
          {isLoading ? (
            // Skeleton loading state
            <>
              {categories.map((category) => (
                <section key={category.id} className="relative py-6">
                  <div className="container mx-auto px-4 md:px-8 mb-4">
                    <div className="h-8 bg-card rounded-md w-48 animate-pulse" />
                  </div>
                  <VideoCardSkeletonRow count={8} />
                </section>
              ))}
            </>
          ) : (
            // Actual content
            categories.map((category) => (
              <ContentRow
                key={category.id}
                category={category}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
