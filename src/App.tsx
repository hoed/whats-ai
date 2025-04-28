
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/ai-profiles" element={<AIProfiles />} />
            <Route path="/chat/:sessionId" element={<ChatDetail />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/setup-whatsapp" element={<SetupWhatsApp />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
