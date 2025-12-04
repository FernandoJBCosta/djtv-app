import { useState, useEffect } from "react";
import { useBackofficeAuth } from "@/hooks/useBackofficeAuth";
import { BackofficeLogin } from "./BackofficeLogin";
import { CarouselEditor } from "@/components/backoffice/CarouselEditor";
import { CategoryEditor } from "@/components/backoffice/CategoryEditor";
import { XMLPreview } from "@/components/backoffice/XMLPreview";
import { FTPSettingsEditor, getFTPSettings, FTPSettings } from "@/components/backoffice/FTPSettings";
import { XMLData, CarouselItemData, CategoryData } from "@/types/backoffice";
import { generateXML, downloadXML } from "@/utils/xmlGenerator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Upload, Cloud, CloudUpload, Loader2, Settings } from "lucide-react";
import { toast } from "sonner";
import { carouselItems, categories } from "@/data/djtvData";
import { supabase } from "@/integrations/supabase/client";

const PRODUCTION_XML_URL = "https://app.djtv.pt/content/index.xml";

function convertToEditorData(): XMLData {
  const carouselData: CarouselItemData[] = carouselItems.map((item, index) => ({
    id: `carousel-${index}`,
    src: item.src,
    width: item.width,
    height: item.height,
    isLive: item.isLive,
    videoUrl: item.videoUrl,
    videoId: item.videoId,
  }));

  const categoryData: CategoryData[] = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    documentUrl: `/pages/${cat.id}.xml`,
    videos: cat.videos.map((video) => ({
      id: video.id,
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail,
      videoUrl: video.videoUrl,
      duration: video.duration,
    })),
  }));

  return { carousel: carouselData, categories: categoryData };
}

const ADMIN_PASSWORD = "djtv2024";

export default function Backoffice() {
  const { isAuthenticated, isLoading, login, logout } = useBackofficeAuth();
  const [data, setData] = useState<XMLData>({ carousel: [], categories: [] });
  const [activeTab, setActiveTab] = useState("carousel");
  const [isSavingToServer, setIsSavingToServer] = useState(false);
  const [isLoadingFromServer, setIsLoadingFromServer] = useState(false);
  const [ftpSettings, setFtpSettings] = useState<FTPSettings>(getFTPSettings());

  useEffect(() => {
    // Auto-load from server on mount
    const loadFromServer = async () => {
      setIsLoadingFromServer(true);
      try {
        const url = `${PRODUCTION_XML_URL}?t=${Date.now()}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        
        // Parse carousel
        const carouselData: CarouselItemData[] = [];
        const lockups = xmlDoc.querySelectorAll("carousel section lockup");
        lockups.forEach((lockup, index) => {
          const img = lockup.querySelector("img");
          if (img) {
            carouselData.push({
              id: `carousel-${index}`,
              title: lockup.getAttribute("title") || undefined,
              src: img.getAttribute("src") || "",
              width: parseInt(img.getAttribute("width") || "1740"),
              height: parseInt(img.getAttribute("height") || "500"),
              isLive: lockup.getAttribute("islive") === "true",
              videoUrl: lockup.getAttribute("videourl") || undefined,
              videoId: lockup.getAttribute("videoid") || undefined,
            });
          }
        });

        // Parse categories
        const categoryData: CategoryData[] = [];
        const separators = xmlDoc.querySelectorAll("separator");
        const shelves = xmlDoc.querySelectorAll("shelf");

        separators.forEach((separator, index) => {
          const button = separator.querySelector("button");
          const name = button?.querySelector("text")?.textContent || "";
          const documentUrl = button?.getAttribute("documenturl") || "";
          const shelf = shelves[index];
          const videos: XMLData["categories"][0]["videos"] = [];

          if (shelf) {
            shelf.querySelectorAll("lockup").forEach((lockup) => {
              const img = lockup.querySelector("img");
              videos.push({
                id: lockup.getAttribute("videoid") || `video-${Date.now()}-${Math.random()}`,
                title: lockup.querySelector("title")?.textContent || "",
                description: lockup.querySelector("description")?.textContent || "",
                thumbnail: img?.getAttribute("src") || "",
                videoUrl: lockup.getAttribute("videourl") || "",
                duration: lockup.getAttribute("duration") || "",
              });
            });
          }

          if (name) {
            categoryData.push({
              id: name.toLowerCase().replace(/\s+/g, "-"),
              name,
              documentUrl,
              videos,
            });
          }
        });

        setData({ carousel: carouselData, categories: categoryData });
      } catch (error) {
        console.log("Using default data - server XML not available");
        setData(convertToEditorData());
      } finally {
        setIsLoadingFromServer(false);
      }
    };
    
    loadFromServer();
  }, []);


  const handleDownload = () => {
    const xml = generateXML(data);
    downloadXML(xml);
    toast.success("XML file downloaded");
  };

  const handleSaveToServer = async () => {
    if (!ftpSettings.host || !ftpSettings.user || !ftpSettings.password) {
      toast.error("Please configure FTP settings first");
      setActiveTab("settings");
      return;
    }

    setIsSavingToServer(true);
    try {
      const xml = generateXML(data);
      const response = await supabase.functions.invoke('ftp-upload', {
        method: 'POST',
        body: { 
          xml, 
          path: ftpSettings.uploadPath,
          host: ftpSettings.host,
          user: ftpSettings.user,
          password: ftpSettings.password,
        },
        headers: {
          'x-admin-password': ADMIN_PASSWORD,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      toast.success("XML uploaded successfully");
    } catch (error) {
      console.error('Save to server error:', error);
      toast.error(`Failed to upload: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSavingToServer(false);
    }
  };

  const handleLoadFromServer = async () => {
    setIsLoadingFromServer(true);
    try {
      // Fetch directly from the production URL with cache busting
      const url = `${PRODUCTION_XML_URL}?t=${Date.now()}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const xmlText = await response.text();

      // Parse the XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      
      // Parse carousel
      const carouselData: CarouselItemData[] = [];
      const lockups = xmlDoc.querySelectorAll("carousel section lockup");
      lockups.forEach((lockup, index) => {
        const img = lockup.querySelector("img");
        if (img) {
          carouselData.push({
            id: `carousel-${index}`,
            title: lockup.getAttribute("title") || undefined,
            src: img.getAttribute("src") || "",
            width: parseInt(img.getAttribute("width") || "1740"),
            height: parseInt(img.getAttribute("height") || "500"),
            isLive: lockup.getAttribute("islive") === "true",
            videoUrl: lockup.getAttribute("videourl") || undefined,
            videoId: lockup.getAttribute("videoid") || undefined,
          });
        }
      });

      // Parse categories
      const categoryData: CategoryData[] = [];
      const separators = xmlDoc.querySelectorAll("separator");
      const shelves = xmlDoc.querySelectorAll("shelf");

      separators.forEach((separator, index) => {
        const button = separator.querySelector("button");
        const name = button?.querySelector("text")?.textContent || "";
        const documentUrl = button?.getAttribute("documenturl") || "";
        const shelf = shelves[index];
        const videos: XMLData["categories"][0]["videos"] = [];

        if (shelf) {
          shelf.querySelectorAll("lockup").forEach((lockup) => {
            const img = lockup.querySelector("img");
            videos.push({
              id: lockup.getAttribute("videoid") || `video-${Date.now()}-${Math.random()}`,
              title: lockup.querySelector("title")?.textContent || "",
              description: lockup.querySelector("description")?.textContent || "",
              thumbnail: img?.getAttribute("src") || "",
              videoUrl: lockup.getAttribute("videourl") || "",
              duration: lockup.getAttribute("duration") || "",
            });
          });
        }

        if (name) {
          categoryData.push({
            id: name.toLowerCase().replace(/\s+/g, "-"),
            name,
            documentUrl,
            videos,
          });
        }
      });

      setData({ carousel: carouselData, categories: categoryData });
      toast.success("XML loaded from app.djtv.pt");
    } catch (error) {
      console.error('Load from server error:', error);
      toast.error("Failed to load from server");
    } finally {
      setIsLoadingFromServer(false);
    }
  };

  const handleLoadFromFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const xmlText = event.target?.result as string;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        
        // Parse carousel
        const carouselData: CarouselItemData[] = [];
        const lockups = xmlDoc.querySelectorAll("carousel section lockup");
        lockups.forEach((lockup, index) => {
          const img = lockup.querySelector("img");
          if (img) {
            carouselData.push({
              id: `carousel-${index}`,
              title: lockup.getAttribute("title") || undefined,
              src: img.getAttribute("src") || "",
              width: parseInt(img.getAttribute("width") || "1740"),
              height: parseInt(img.getAttribute("height") || "500"),
              isLive: lockup.getAttribute("islive") === "true",
              videoUrl: lockup.getAttribute("videourl") || undefined,
              videoId: lockup.getAttribute("videoid") || undefined,
            });
          }
        });

        // Parse categories
        const categoryData: CategoryData[] = [];
        const separators = xmlDoc.querySelectorAll("separator");
        const shelves = xmlDoc.querySelectorAll("shelf");

        separators.forEach((separator, index) => {
          const button = separator.querySelector("button");
          const name = button?.querySelector("text")?.textContent || "";
          const documentUrl = button?.getAttribute("documenturl") || "";
          const shelf = shelves[index];
          const videos: XMLData["categories"][0]["videos"] = [];

          if (shelf) {
            shelf.querySelectorAll("lockup").forEach((lockup) => {
              const img = lockup.querySelector("img");
              videos.push({
                id: lockup.getAttribute("videoid") || `video-${Date.now()}-${Math.random()}`,
                title: lockup.querySelector("title")?.textContent || "",
                description: lockup.querySelector("description")?.textContent || "",
                thumbnail: img?.getAttribute("src") || "",
                videoUrl: lockup.getAttribute("videourl") || "",
                duration: lockup.getAttribute("duration") || "",
              });
            });
          }

          if (name) {
            categoryData.push({
              id: name.toLowerCase().replace(/\s+/g, "-"),
              name,
              documentUrl,
              videos,
            });
          }
        });

        setData({ carousel: carouselData, categories: categoryData });
        toast.success("XML file loaded successfully");
      } catch (error) {
        toast.error("Failed to parse XML file");
        console.error(error);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <BackofficeLogin onLogin={login} />;
  }

  const xml = generateXML(data);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h1 className="text-xl font-bold">DJTV Backoffice</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={handleLoadFromServer} variant="outline" size="sm" disabled={isLoadingFromServer}>
              {isLoadingFromServer ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Cloud className="h-4 w-4 mr-1" />}
              Load from Server
            </Button>
            <Button onClick={handleSaveToServer} variant="default" size="sm" disabled={isSavingToServer}>
              {isSavingToServer ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <CloudUpload className="h-4 w-4 mr-1" />}
              Save to Server
            </Button>
            <div className="border-l h-6 mx-1 hidden sm:block" />
            <label className="cursor-pointer">
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-1" /> Load File
                </span>
              </Button>
              <input type="file" accept=".xml" onChange={handleLoadFromFile} className="hidden" />
            </label>
            <Button onClick={logout} variant="ghost" size="sm">
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="carousel">Carousel</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="preview">XML Preview</TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="carousel">
            <CarouselEditor
              items={data.carousel}
              onChange={(carousel) => setData({ ...data, carousel })}
            />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryEditor
              categories={data.categories}
              onChange={(categories) => setData({ ...data, categories })}
            />
          </TabsContent>

          <TabsContent value="preview">
            <XMLPreview xml={xml} onDownload={handleDownload} />
          </TabsContent>

          <TabsContent value="settings">
            <FTPSettingsEditor onSettingsChange={setFtpSettings} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
