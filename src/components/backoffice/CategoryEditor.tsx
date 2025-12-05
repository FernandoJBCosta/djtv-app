import { useState } from "react";
import { CategoryData, VideoData } from "@/types/backoffice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Plus, Trash2, ChevronDown, ChevronRight, FolderOpen, Video } from "lucide-react";

interface CategoryEditorProps {
  categories: CategoryData[];
  onChange: (categories: CategoryData[]) => void;
}

export function CategoryEditor({ categories, onChange }: CategoryEditorProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);

  const addCategory = () => {
    const newCategory: CategoryData = {
      id: `category-${Date.now()}`,
      name: "New Category",
      videos: [],
    };
    onChange([...categories, newCategory]);
    setExpandedCategory(newCategory.id);
  };

  const updateCategory = (id: string, updates: Partial<CategoryData>) => {
    onChange(categories.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat)));
  };

  const removeCategory = (id: string) => {
    onChange(categories.filter((cat) => cat.id !== id));
  };

  const addVideo = (categoryId: string) => {
    const newVideo: VideoData = {
      id: `video-${Date.now()}`,
      title: "New Video",
      description: "",
      thumbnail: "",
      videoUrl: "",
    };
    onChange(
      categories.map((cat) =>
        cat.id === categoryId ? { ...cat, videos: [...cat.videos, newVideo] } : cat
      )
    );
    setExpandedVideo(newVideo.id);
  };

  const updateVideo = (categoryId: string, videoId: string, updates: Partial<VideoData>) => {
    // If updating the video ID, also update the expandedVideo state
    if (updates.id && expandedVideo === videoId) {
      setExpandedVideo(updates.id);
    }
    onChange(
      categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, videos: cat.videos.map((v) => (v.id === videoId ? { ...v, ...updates } : v)) }
          : cat
      )
    );
  };

  const removeVideo = (categoryId: string, videoId: string) => {
    onChange(
      categories.map((cat) =>
        cat.id === categoryId ? { ...cat, videos: cat.videos.filter((v) => v.id !== videoId) } : cat
      )
    );
  };

  const moveCategory = (index: number, direction: "up" | "down") => {
    const newCategories = [...categories];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= categories.length) return;
    [newCategories[index], newCategories[newIndex]] = [newCategories[newIndex], newCategories[index]];
    onChange(newCategories);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          Categories & Videos
        </CardTitle>
        <Button onClick={addCategory} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add Category
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.length === 0 && (
          <p className="text-muted-foreground text-center py-8">No categories. Click "Add Category" to create one.</p>
        )}
        {categories.map((category, catIndex) => (
          <Collapsible
            key={category.id}
            open={expandedCategory === category.id}
            onOpenChange={(open) => setExpandedCategory(open ? category.id : null)}
          >
            <div className="border rounded-lg">
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50">
                  <div className="flex items-center gap-2">
                    {expandedCategory === category.id ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <span className="font-medium">{category.name}</span>
                    <span className="text-sm text-muted-foreground">({category.videos.length} videos)</span>
                  </div>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" onClick={() => moveCategory(catIndex, "up")} disabled={catIndex === 0}>
                      ↑
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => moveCategory(catIndex, "down")} disabled={catIndex === categories.length - 1}>
                      ↓
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => removeCategory(category.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="p-4 pt-0 space-y-4 border-t">
                  <div className="space-y-2">
                    <Label>Category Name</Label>
                    <Input
                      value={category.name}
                      onChange={(e) => updateCategory(category.id, { name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        Videos
                      </h4>
                      <Button onClick={() => addVideo(category.id)} size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-1" /> Add Video
                      </Button>
                    </div>

                    {category.videos.map((video) => (
                      <div key={video.id} className="border rounded-lg p-3 bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{video.title}</span>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setExpandedVideo(expandedVideo === video.id ? null : video.id)}
                            >
                              {expandedVideo === video.id ? "Collapse" : "Edit"}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => removeVideo(category.id, video.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>

                        {expandedVideo === video.id && (
                          <div className="space-y-3 pt-2 border-t">
                            <div className="grid gap-3 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label className="text-xs">Title</Label>
                                <Input
                                  value={video.title}
                                  onChange={(e) => updateVideo(category.id, video.id, { title: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs">Video ID</Label>
                                <Input
                                  value={video.id}
                                  onChange={(e) => updateVideo(category.id, video.id, { id: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">Description</Label>
                              <Textarea
                                value={video.description}
                                onChange={(e) => updateVideo(category.id, video.id, { description: e.target.value })}
                                rows={2}
                              />
                            </div>
                            <div className="grid gap-3 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label className="text-xs">Thumbnail URL</Label>
                                <Input
                                  value={video.thumbnail}
                                  onChange={(e) => updateVideo(category.id, video.id, { thumbnail: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs">Video URL</Label>
                                <Input
                                  value={video.videoUrl}
                                  onChange={(e) => updateVideo(category.id, video.id, { videoUrl: e.target.value })}
                                />
                              </div>
                            </div>
                            {video.thumbnail && (
                              <div>
                                <Label className="text-xs text-muted-foreground">Thumbnail Preview</Label>
                                <img
                                  src={video.thumbnail}
                                  alt="Thumbnail"
                                  className="mt-1 w-32 h-auto rounded border"
                                  onError={(e) => (e.currentTarget.style.display = "none")}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}
      </CardContent>
    </Card>
  );
}
