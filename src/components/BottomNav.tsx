import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Grid3X3, Settings, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchModal } from "./SearchModal";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/categories", label: "Categories", icon: Grid3X3 },
  { id: "search", label: "Search", icon: Search },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function BottomNav() {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isSearch = item.id === "search";
            const isActive = !isSearch && location.pathname === item.href;
            
            if (isSearch) {
              return (
                <button
                  key="search"
                  onClick={() => setSearchOpen(true)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                    "text-muted-foreground hover:text-primary"
                  )}
                >
                  <Search className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            }
            
            return (
              <Link
                key={item.href}
                to={item.href!}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive && "text-primary")} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
