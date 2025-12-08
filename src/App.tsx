import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Recipes from "./pages/Recipes";
import Locations from "./pages/Locations";
import Blog from "./pages/Blog";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Today from "./pages/Today";
import Statistics from "./pages/Statistics";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/today" element={<Today />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/admin" element={<Admin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
