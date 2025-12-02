import { useState, useEffect } from "react";
import { Search, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import djtvLogo from "@/assets/djtv-logo.png";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "bg-background/95 backdrop-blur-md" : "bg-gradient-to-b from-background/80 to-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src={djtvLogo} alt="DJTV" className="h-10 md:h-12 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              Home
            </a>
            <a href="#" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              Live
            </a>
            <a href="#" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              Categories
            </a>
            <a href="#" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              My List
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-primary">
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

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border animate-fade-up">
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
            <a href="#" className="text-foreground/80 hover:text-primary transition-colors font-medium py-2">
              Home
            </a>
            <a href="#" className="text-foreground/80 hover:text-primary transition-colors font-medium py-2">
              Live
            </a>
            <a href="#" className="text-foreground/80 hover:text-primary transition-colors font-medium py-2">
              Categories
            </a>
            <a href="#" className="text-foreground/80 hover:text-primary transition-colors font-medium py-2">
              My List
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
