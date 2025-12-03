import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Carousel } from "@/components/Carousel";
import { ContentRow } from "@/components/ContentRow";
import { carouselItems as defaultCarouselItems, categories as defaultCategories } from "@/data/djtvData";
import { fetchAndParseXML } from "@/services/xmlParser";
import { CarouselItem, Category } from "@/types/video";

const SERVER_XML_URL = 'https://app.djtv.pt/content/index.xml';

const Index = () => {
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>(defaultCarouselItems);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Add cache-busting parameter
        const url = `${SERVER_XML_URL}?t=${Date.now()}`;
        const data = await fetchAndParseXML(url);
        console.log("Loaded XML data:", data);
        if (data.carousel.length > 0) {
          setCarouselItems(data.carousel);
        }
        if (data.categories.length > 0) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.log("Using default data - server XML not available");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

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
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
