import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Live from "./pages/Live";
import Categories from "./pages/Categories";
import DJProfile from "./pages/DJProfile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { usePushNotifications } from "./hooks/usePushNotifications";

const queryClient = new QueryClient();

const App = () => {
  // Initialize push notifications on native platforms
  usePushNotifications();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/live" element={<Live />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/dj/:id" element={<DJProfile />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
