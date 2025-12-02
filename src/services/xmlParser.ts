import { Category, Video } from "@/types/video";

const BASE_URL = "https://app.djtv.pt";

interface CarouselItem {
  src: string;
  width: number;
  height: number;
}

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
        carousel.push({
          src: img.getAttribute("src") || "",
          width: parseInt(img.getAttribute("width") || "1740"),
          height: parseInt(img.getAttribute("height") || "500"),
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
        
        if (img && title) {
          videos.push({
            id: `${categoryName.toLowerCase()}-${lockupIndex}`,
            title: title,
            description: `${title} - ${categoryName}`,
            thumbnail: img.getAttribute("src") || "",
            videoUrl: "", // Will be populated from detail page
            duration: "",
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
