import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EnvironmentalProvider } from "./context/EnvironmentalContext";
import { AppLayout } from "./components/AppLayout";
import Index from "./pages/Index";
import WaterManagement from "./pages/WaterManagement";
import WasteManagement from "./pages/WasteManagement";
import WasteToEnergy from "./pages/WasteToEnergy";
import RenewableEnergy from "./pages/RenewableEnergy";
import SustainableMaterials from "./pages/SustainableMaterials";
import AIMonitoring from "./pages/AIMonitoring";
import EnvironmentalGIS from "./pages/EnvironmentalGIS";
import Education from "./pages/Education";
import SDGDashboard from "./pages/SDGDashboard";
import Requirements from "./pages/Requirements";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <EnvironmentalProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/water-management" element={<WaterManagement />} />
              <Route path="/waste-management" element={<WasteManagement />} />
              <Route path="/waste-to-energy" element={<WasteToEnergy />} />
              <Route path="/renewable-energy" element={<RenewableEnergy />} />
              <Route path="/sustainable-materials" element={<SustainableMaterials />} />
              <Route path="/ai-monitoring" element={<AIMonitoring />} />
              <Route path="/environmental-gis" element={<EnvironmentalGIS />} />
              <Route path="/education" element={<Education />} />
              <Route path="/sdg-dashboard" element={<SDGDashboard />} />
              <Route path="/requirements" element={<Requirements />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </EnvironmentalProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
