import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import BrandDNA from "./pages/BrandDNA";
import Home from "./pages/Home";
import ProfileAnalytics from "./pages/ProfileAnalytics";
import Campaigns from "./pages/Campaigns";
import Competitors from "./pages/Competitors";
import Trends from "./pages/Trends";
import Schedule from "./pages/Schedule";
import Settings from "./pages/Settings";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/brand-dna" element={<BrandDNA />} />
          <Route path="/dashboard" element={<Layout><Home /></Layout>} />
          <Route path="/analytics" element={<Layout><ProfileAnalytics /></Layout>} />
          <Route path="/campaigns" element={<Layout><Campaigns /></Layout>} />
          <Route path="/competitors" element={<Layout><Competitors /></Layout>} />
          <Route path="/trends" element={<Layout><Trends /></Layout>} />
          <Route path="/schedule" element={<Layout><Schedule /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
