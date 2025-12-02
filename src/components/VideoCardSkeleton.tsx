import { cn } from "@/lib/utils";

interface VideoCardSkeletonProps {
  className?: string;
  index?: number;
}

export function VideoCardSkeleton({ className, index = 0 }: VideoCardSkeletonProps) {
  const animationDelay = Math.min(index * 75, 600);

  return (
    <div
      className={cn(
        "flex-shrink-0 w-[180px] sm:w-[200px] md:w-[220px] pt-3",
        "opacity-0 animate-[fade-in-up_0.5s_ease-out_forwards]",
        className
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Thumbnail Skeleton */}
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-card">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted/20 to-transparent animate-[shimmer_1.5s_infinite] -translate-x-full" 
          style={{ 
            animation: 'shimmer 1.5s infinite',
            background: 'linear-gradient(90deg, transparent, hsl(var(--muted)/0.3), transparent)'
          }} 
        />
      </div>

      {/* Info Skeleton */}
      <div className="mt-4 px-1 space-y-2">
        <div className="h-5 bg-card rounded-md w-3/4 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted/20 to-transparent animate-pulse" />
        </div>
        <div className="h-4 bg-card rounded-md w-1/2 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted/20 to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function VideoCardSkeletonRow({ count = 8 }: { count?: number }) {
  return (
    <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4 md:px-8 pb-4">
      {Array.from({ length: count }).map((_, i) => (
        <VideoCardSkeleton key={i} index={i} />
      ))}
    </div>
  );
}

export function VideoCardSkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <VideoCardSkeleton key={i} index={i} className="w-full" />
      ))}
    </div>
  );
}
