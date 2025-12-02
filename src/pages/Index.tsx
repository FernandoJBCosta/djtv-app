import { Header } from "@/components/Header";
import { Carousel } from "@/components/Carousel";
import { ContentRow } from "@/components/ContentRow";
import { LiveBanner } from "@/components/LiveBanner";
import { carouselItems, categories } from "@/data/djtvData";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <Carousel items={carouselItems} />
        
        <LiveBanner />
        
        <div className="relative z-10 pb-20">
          {categories.map((category) => (
            <ContentRow
              key={category.id}
              category={category}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
