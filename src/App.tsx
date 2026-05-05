import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/i18n/I18nProvider";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import SkillDetail from "./pages/SkillDetail.tsx";
import Records from "./pages/Records.tsx";
import Circuits from "./pages/Circuits.tsx";
import Stability from "./pages/Stability.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/skill/:id" element={<SkillDetail />} />
            <Route path="/records" element={<Records />} />
            <Route path="/circuits" element={<Circuits />} />
            <Route path="/stability" element={<Stability />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
