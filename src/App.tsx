import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/i18n/I18nProvider";
import { AuthProvider } from "@/hooks/useAuth";
import { UserDataProvider } from "@/hooks/UserDataProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import SkillDetail from "./pages/SkillDetail.tsx";
import Records from "./pages/Records.tsx";
import Leaderboard from "./pages/Leaderboard.tsx";
import Circuits from "./pages/Circuits.tsx";
import Stability from "./pages/Stability.tsx";
import Stretching from "./pages/Stretching.tsx";
import Legs from "./pages/Legs.tsx";
import WorkoutPlan from "./pages/WorkoutPlan.tsx";
import Auth from "./pages/Auth.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import LeadModal from "./components/LeadModal";
import AppLayout from "./components/AppLayout";
import WhatsAppFab from "./components/WhatsAppFab";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <UserDataProvider>
              <LeadModal />
              <WhatsAppFab />
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/" element={<Index />} />
                  <Route path="/skill/:id" element={<SkillDetail />} />
                  <Route path="/records" element={<Records />} />
                  <Route path="/classifica" element={<Leaderboard />} />
                  <Route path="/circuits" element={<Circuits />} />
                  <Route path="/stability" element={<Stability />} />
                  <Route path="/stretching" element={<Stretching />} />
                  <Route path="/legs" element={<Legs />} />
                  <Route path="/scheda" element={<WorkoutPlan />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </UserDataProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
