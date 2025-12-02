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
}

export interface Category {
  id: string;
  name: string;
  videos: Video[];
}
