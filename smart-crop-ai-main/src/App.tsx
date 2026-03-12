import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Auth from "./pages/Auth";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import CropRecommendation from "./pages/dashboard/CropRecommendation";
import DiseaseDetection from "./pages/dashboard/DiseaseDetection";
import YieldPrediction from "./pages/dashboard/YieldPrediction";
import MarketPrices from "./pages/dashboard/MarketPrices";
import WeatherIntelligence from "./pages/dashboard/WeatherIntelligence";
import PestAdvisory from "./pages/dashboard/PestAdvisory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-12 h-12 gradient-green rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-green">
          <span className="text-2xl">🌱</span>
        </div>
        <p className="text-muted-foreground">Loading SmartCrop AI...</p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard/*" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Routes>
                    <Route index element={<DashboardOverview />} />
                    <Route path="crop-recommendation" element={<CropRecommendation />} />
                    <Route path="disease-detection" element={<DiseaseDetection />} />
                    <Route path="yield-prediction" element={<YieldPrediction />} />
                    <Route path="market-prices" element={<MarketPrices />} />
                    <Route path="weather" element={<WeatherIntelligence />} />
                    <Route path="pest-advisory" element={<PestAdvisory />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
