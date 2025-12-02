export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  category: string;
  year?: string;
  rating?: string;
  documentUrl?: string;
}

export interface CarouselItem {
  src: string;
  width: number;
  height: number;
  videoId?: string;
  videoUrl?: string;
  isLive?: boolean;
}

export interface Category {
  id: string;
  name: string;
  videos: Video[];
}
