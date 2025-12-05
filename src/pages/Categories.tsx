import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { VideoCard } from "@/components/VideoCard";
import { categories as defaultCategories } from "@/data/djtvData";
import { fetchAndParseXML } from "@/services/xmlParser";
import { Category } from "@/types/video";
import { cn } from "@/lib/utils";
import { MobileLayout } from "@/components/MobileLayout";

const SERVER_XML_URL = "https://app.djtv.pt/content/index.xml";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const url = `${SERVER_XML_URL}?t=${Date.now()}`;
        const data = await fetchAndParseXML(url);
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

  const filteredCategories = activeCategory
    ? categories.filter((cat) => cat.id === activeCategory)
    : categories;

  return (
    <MobileLayout>
      <div className="min-h-screen bg-background pb-20">
        <Header />

        <main className="pt-20">
          <div className="container mx-auto px-4 md:px-8 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="font-display text-4xl md:text-5xl mb-4">Categories</h1>
              <p className="text-muted-foreground text-lg">Browse DJs by genre</p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 mb-10">
              <button
                onClick={() => setActiveCategory(null)}
                className={cn(
                  "px-5 py-2.5 rounded-full font-medium transition-all duration-300",
                  activeCategory === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-card hover:bg-card/80 text-foreground/80 hover:text-foreground"
                )}
              >
                All Genres
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "px-5 py-2.5 rounded-full font-medium transition-all duration-300",
                    activeCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-card hover:bg-card/80 text-foreground/80 hover:text-foreground"
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Categories Grid */}
            {filteredCategories.map((category) => (
              <section key={category.id} className="mb-12">
                <h2 className="font-display text-2xl md:text-3xl mb-6 flex items-center gap-3">
                  {category.name}
                  <span className="text-sm font-normal text-muted-foreground bg-card px-3 py-1 rounded-full">
                    {category.videos.length} DJs
                  </span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {category.videos.map((video, index) => (
                    <VideoCard key={video.id} video={video} className="w-full" index={index} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </main>
      </div>
    </MobileLayout>
  );
};

export default Categories;
