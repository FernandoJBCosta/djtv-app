import { Category, Video } from "@/types/video";

export const featuredVideo: Video = {
  id: "featured-1",
  title: "DJTV Live Sessions",
  description: "Experience the best DJ performances from around the world. Exclusive live sessions featuring top artists and underground talents.",
  thumbnail: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=1920&q=80",
  videoUrl: "https://playout.djtv.pt/featured/live-sessions.m3u8",
  duration: "2:34:00",
  category: "Live",
  year: "2024",
  rating: "HD"
};

export const categories: Category[] = [
  {
    id: "trending",
    name: "Trending Now",
    videos: [
      {
        id: "1",
        title: "Techno Night Berlin",
        description: "Underground techno from Berlin's finest",
        thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=640&q=80",
        videoUrl: "https://playout.djtv.pt/techno/berlin.m3u8",
        duration: "1:45:00",
        category: "Techno"
      },
      {
        id: "2",
        title: "House Classics",
        description: "Timeless house music selections",
        thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=640&q=80",
        videoUrl: "https://playout.djtv.pt/house/classics.m3u8",
        duration: "2:00:00",
        category: "House"
      },
      {
        id: "3",
        title: "Ibiza Sunset",
        description: "Chill vibes from the White Isle",
        thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=640&q=80",
        videoUrl: "https://playout.djtv.pt/chill/ibiza.m3u8",
        duration: "1:30:00",
        category: "Chill"
      },
      {
        id: "4",
        title: "Festival Highlights",
        description: "Best moments from major festivals",
        thumbnail: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=640&q=80",
        videoUrl: "https://playout.djtv.pt/festival/highlights.m3u8",
        duration: "3:00:00",
        category: "Festival"
      },
      {
        id: "5",
        title: "Vinyl Sessions",
        description: "Pure vinyl DJ sets",
        thumbnail: "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=640&q=80",
        videoUrl: "https://playout.djtv.pt/vinyl/sessions.m3u8",
        duration: "2:15:00",
        category: "Vinyl"
      }
    ]
  },
  {
    id: "live",
    name: "Live Performances",
    videos: [
      {
        id: "6",
        title: "Club Night NYC",
        description: "Live from New York's hottest club",
        thumbnail: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=640&q=80",
        videoUrl: "https://playout.djtv.pt/live/nyc.m3u8",
        duration: "4:00:00",
        category: "Live"
      },
      {
        id: "7",
        title: "Warehouse Rave",
        description: "Underground warehouse party",
        thumbnail: "https://images.unsplash.com/photo-1504680177321-2e6a879aac86?w=640&q=80",
        videoUrl: "https://playout.djtv.pt/live/warehouse.m3u8",
        duration: "5:30:00",
        category: "Live"
      },
      {
        id: "8",
        title: "Rooftop Sessions",
        description: "Sunset sessions above the city",
        thumbnail: "https://images.unsplash.com/photo-1508997449629-303059a039c0?w=640&q=80",
        videoUrl: "https://playout.djtv.pt/live/rooftop.m3u8",
        duration: "2:45:00",
        category: "Live"
      },
      {
        id: "9",
        title: "Beach Party Miami",
        description: "Ocean views and deep beats",
        thumbnail: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=640&q=80",
        videoUrl: "https://playout.djtv.pt/live/miami.m3u8",
        duration: "3:15:00",
        category: "Live"
      },
      {
        id: "10",
        title: "Studio Sessions",
        description: "Intimate studio performances",
        thumbnail: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=640&q=80",
        videoUrl: "https://playout.djtv.pt/live/studio.m3u8",
        duration: "1:00:00",
        category: "Live"
      }
    ]
  },
  {
    id: "genres",
    name: "Explore Genres",
    videos: [
      {
        id: "11",
        title: "Deep House Journey",
        description: "Melodic deep house selections",
        thumbnail: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=640&q=80",
        videoUrl: "https://playout.djtv.pt/genres/deephouse.m3u8",
        duration: "2:30:00",
        category: "Deep House"
      },
      {
        id: "12",
        title: "Drum & Bass Energy",
        description: "High-energy DnB sessions",
        thumbnail: "https://images.unsplash.com/photo-1571935441280-0444d8a98ee3?w=640&q=80",
        videoUrl: "https://playout.djtv.pt/genres/dnb.m3u8",
        duration: "1:45:00",
        category: "Drum & Bass"
      },
      {
        id: "13",
        title: "Trance Classics",
        description: "Euphoric trance anthems",
        thumbnail: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=640&q=80",
        videoUrl: "https://playout.djtv.pt/genres/trance.m3u8",
        duration: "3:00:00",
        category: "Trance"
      },
      {
        id: "14",
        title: "Minimal Techno",
        description: "Stripped-back techno grooves",
        thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&q=80",
        videoUrl: "https://playout.djtv.pt/genres/minimal.m3u8",
        duration: "2:00:00",
        category: "Minimal"
      },
      {
        id: "15",
        title: "Afro House Vibes",
        description: "Rhythmic African-inspired house",
        thumbnail: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=640&q=80",
        videoUrl: "https://playout.djtv.pt/genres/afrohouse.m3u8",
        duration: "2:15:00",
        category: "Afro House"
      }
    ]
  }
];
