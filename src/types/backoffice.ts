export interface CarouselItemData {
  id: string;
  title?: string;
  src: string;
  width: number;
  height: number;
  isLive?: boolean;
  videoUrl?: string;
  videoId?: string;
}

export interface VideoData {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
}

export interface CategoryData {
  id: string;
  name: string;
  documentUrl: string;
  videos: VideoData[];
}

export interface XMLData {
  carousel: CarouselItemData[];
  categories: CategoryData[];
}
