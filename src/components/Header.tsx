import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, Instagram, Facebook, Download, LucideIcon } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { SearchModal } from "./SearchModal";
import { Capacitor } from "@capacitor/core";

interface NavLink {
  href: string;
  label: string;
  icon?: LucideIcon;
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  
  const isNativeApp = Capacitor.isNativePlatform();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks: NavLink[] = useMemo(() => {
    const links: NavLink[] = [
      { href: "/", label: "Home" },
      { href: "/categories", label: "Categories" },
    ];
    
    // Only show Install App on web, not in native apps
    if (!isNativeApp) {
      links.push({ href: "/install", label: "Install App", icon: Download });
    }
    
    return links;
  }, [isNativeApp]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 pt-[env(safe-area-inset-top)]",
        scrolled ? "bg-background/95 backdrop-blur-md" : "bg-gradient-to-b from-background/80 to-transparent",
      )}
    >
      <div className="container mx-auto px-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] md:px-8">
        <div className="flex items-center justify-between h-14 md:h-20">
          {/* Empty space where logo was */}
          <Link to="/" className="flex items-center">
            <span className="sr-only">DJTV Home</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "transition-colors font-medium flex items-center gap-1.5",
                  location.pathname === link.href ? "text-primary" : "text-foreground/80 hover:text-primary",
                )}
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-foreground/80 hover:text-primary"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-foreground/80"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Slide-in */}
      <div 
        className={cn(
          "md:hidden fixed top-0 right-0 h-full w-64 bg-background/95 backdrop-blur-md border-l border-border z-50 transition-transform duration-300 ease-out pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)]",
          menuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-end p-4 border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground/80"
            onClick={() => setMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <nav className="px-6 py-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "transition-colors font-medium py-3 px-4 rounded-lg flex items-center gap-2",
                location.pathname === link.href 
                  ? "text-primary bg-primary/10" 
                  : "text-foreground/80 hover:text-primary hover:bg-muted"
              )}
            >
              {link.icon && <link.icon className="w-4 h-4" />}
              {link.label}
            </Link>
          ))}
        </nav>
        
        {/* Social Media Links */}
        <div className="px-6 mt-auto pb-8 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">Follow Us</p>
          <div className="flex items-center gap-4">
            <a 
              href="https://www.instagram.com/djtv_pt/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-primary transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a 
              href="https://www.facebook.com/DJTV.PT" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-primary transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
