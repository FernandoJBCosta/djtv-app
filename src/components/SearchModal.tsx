import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { categories } from "@/data/djtvData";
import { Video } from "@/types/video";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  // Get all videos from all categories
  const allVideos = useMemo(() => {
    return categories.flatMap((category) => category.videos);
  }, []);

  // Filter videos based on search query
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return allVideos.filter(
      (video) =>
        video.title.toLowerCase().includes(lowerQuery) ||
        video.description.toLowerCase().includes(lowerQuery) ||
        video.category.toLowerCase().includes(lowerQuery)
    );
  }, [query, allVideos]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleSelect = (video: Video) => {
    navigate(`/dj/${video.id}`);
    onClose();
    setQuery("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md animate-fade-in">
      <div className="container mx-auto px-4 pt-20">
        {/* Search Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search DJs by name, genre..."
              className="pl-12 h-14 text-lg bg-secondary border-border focus:border-primary"
            />
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-full hover:bg-secondary transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[70vh] overflow-y-auto">
          {query.trim() && searchResults.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              No DJs found for "{query}"
            </p>
          )}

          {searchResults.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {searchResults.map((video) => (
                <button
                  key={video.id}
                  onClick={() => handleSelect(video)}
                  className="group text-left rounded-lg overflow-hidden bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="aspect-[2/3] relative overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium truncate">{video.title}</h3>
                    <p className="text-sm text-muted-foreground">{video.category}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!query.trim() && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Start typing to search DJs...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
