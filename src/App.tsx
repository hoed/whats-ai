
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Contacts from "./pages/Contacts";
import Templates from "./pages/Templates";
import AIProfiles from "./pages/AIProfiles";
import ChatDetail from "./pages/ChatDetail";
import Settings from "./pages/Settings";
import SetupWhatsApp from "./pages/SetupWhatsApp";
import Analytics from "./pages/Analytics";
import Training from "./pages/Training";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Manual from "./pages/Manual";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/manual" element={<Manual />} />
            <Route path="/dashboard" element={<Index />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/ai-profiles" element={<AIProfiles />} />
            <Route path="/chat/:sessionId" element={<ChatDetail />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/setup-whatsapp" element={<SetupWhatsApp />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/training" element={<Training />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
