import { Category, Video, CarouselItem } from "@/types/video";

const BASE_URL = "https://app.djtv.pt";

interface ParsedData {
  carousel: CarouselItem[];
  categories: Category[];
}

export async function fetchAndParseXML(url: string): Promise<ParsedData> {
  try {
    const response = await fetch(url);
    const xmlText = await response.text();
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    
    return parseXMLDocument(xmlDoc);
  } catch (error) {
    console.error("Error fetching XML:", error);
    throw error;
  }
}

function parseXMLDocument(xmlDoc: Document): ParsedData {
  const carousel: CarouselItem[] = [];
  const categories: Category[] = [];
  
  // Parse carousel images
  const carouselSection = xmlDoc.querySelector("carousel section");
  if (carouselSection) {
    const lockups = carouselSection.querySelectorAll("lockup");
    lockups.forEach((lockup) => {
      const img = lockup.querySelector("img");
      if (img) {
        const isLive = lockup.getAttribute("islive") === "true";
        const videoUrl = lockup.getAttribute("videourl") || undefined;
        const videoId = lockup.getAttribute("videoid") || undefined;
        
        carousel.push({
          src: img.getAttribute("src") || "",
          width: parseInt(img.getAttribute("width") || "1740"),
          height: parseInt(img.getAttribute("height") || "500"),
          isLive,
          videoUrl,
          videoId,
        });
      }
    });
  }
  
  // Parse categories (separators with shelves)
  const separators = xmlDoc.querySelectorAll("separator");
  const shelves = xmlDoc.querySelectorAll("shelf");
  
  separators.forEach((separator, index) => {
    const button = separator.querySelector("button");
    const categoryName = button?.querySelector("text")?.textContent || "";
    const documentUrl = button?.getAttribute("documenturl") || "";
    
    const shelf = shelves[index];
    const videos: Video[] = [];
    
    if (shelf) {
      const lockups = shelf.querySelectorAll("lockup");
      lockups.forEach((lockup, lockupIndex) => {
        const img = lockup.querySelector("img");
        const title = lockup.querySelector("title")?.textContent || "";
        const description = lockup.querySelector("description")?.textContent || `${title} - ${categoryName}`;
        const videoUrl = lockup.getAttribute("videourl") || "";
        const videoId = lockup.getAttribute("videoid") || `${categoryName.toLowerCase()}-${lockupIndex}`;
        const duration = lockup.getAttribute("duration") || "";
        
        if (img && title) {
          videos.push({
            id: videoId,
            title: title,
            description: description,
            thumbnail: img.getAttribute("src") || "",
            videoUrl: videoUrl,
            duration: duration,
            category: categoryName,
            documentUrl: documentUrl,
          });
        }
      });
    }
    
    if (categoryName && videos.length > 0) {
      categories.push({
        id: categoryName.toLowerCase().replace(/\s+/g, "-"),
        name: categoryName,
        videos,
      });
    }
  });
  
  return { carousel, categories };
}

export async function fetchHomeData(): Promise<ParsedData> {
  return fetchAndParseXML(`${BASE_URL}/pages/index.xml`);
}
