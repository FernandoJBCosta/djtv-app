import { useState } from "react";
import { CarouselItemData } from "@/types/backoffice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GripVertical, Image } from "lucide-react";

interface CarouselEditorProps {
  items: CarouselItemData[];
  onChange: (items: CarouselItemData[]) => void;
}

export function CarouselEditor({ items, onChange }: CarouselEditorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addItem = () => {
    const newItem: CarouselItemData = {
      id: `carousel-${Date.now()}`,
      src: "",
      width: 1740,
      height: 500,
      isLive: false,
    };
    onChange([...items, newItem]);
    setExpandedId(newItem.id);
  };

  const updateItem = (id: string, updates: Partial<CarouselItemData>) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newItems = [...items];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    onChange(newItems);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Carousel Banners
        </CardTitle>
        <Button onClick={addItem} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add Banner
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 && (
          <p className="text-muted-foreground text-center py-8">No carousel items. Click "Add Banner" to create one.</p>
        )}
        {items.map((item, index) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 bg-card"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Banner {index + 1}</span>
                {item.isLive && (
                  <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded">LIVE</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => moveItem(index, "up")} disabled={index === 0}>
                  ↑
                </Button>
                <Button variant="ghost" size="sm" onClick={() => moveItem(index, "down")} disabled={index === items.length - 1}>
                  ↓
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
                  {expandedId === item.id ? "Collapse" : "Edit"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>

            {expandedId === item.id && (
              <div className="space-y-4 pt-3 border-t">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input
                      value={item.src}
                      onChange={(e) => updateItem(item.id, { src: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={item.isLive || false}
                        onCheckedChange={(checked) => updateItem(item.id, { isLive: checked })}
                      />
                      <Label>Is Live</Label>
                    </div>
                  </div>
                </div>

                {!item.isLive && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Video URL (optional)</Label>
                      <Input
                        value={item.videoUrl || ""}
                        onChange={(e) => updateItem(item.id, { videoUrl: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Video ID (optional)</Label>
                      <Input
                        value={item.videoId || ""}
                        onChange={(e) => updateItem(item.id, { videoId: e.target.value })}
                        placeholder="video-id"
                      />
                    </div>
                  </div>
                )}

                {item.src && (
                  <div className="mt-4">
                    <Label className="text-xs text-muted-foreground">Preview</Label>
                    <img
                      src={item.src}
                      alt="Banner preview"
                      className="mt-1 w-full max-w-md h-auto rounded border"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
