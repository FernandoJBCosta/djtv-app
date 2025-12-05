import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Live from "./pages/Live";
import VideoPlayer from "./pages/VideoPlayer";
import Categories from "./pages/Categories";
import DJProfile from "./pages/DJProfile";
import Backoffice from "./pages/Backoffice";
import Install from "./pages/Install";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import SplashScreen from "./components/SplashScreen";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/live" element={<Live />} />
            <Route path="/video" element={<VideoPlayer />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/dj/:id" element={<DJProfile />} />
            <Route path="/install" element={<Install />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/backoffice" element={<Backoffice />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
