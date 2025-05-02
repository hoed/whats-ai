
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Pages
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Auth from '@/pages/Auth';
import NotFound from '@/pages/NotFound';
import Chats from '@/pages/Chats';
import ChatDetail from '@/pages/ChatDetail';
import Contacts from '@/pages/Contacts';
import AIProfiles from '@/pages/AIProfiles';
import Templates from '@/pages/Templates';
import Training from '@/pages/Training';
import Analytics from '@/pages/Analytics';
import Settings from '@/pages/Settings';
import VoiceSettings from '@/pages/VoiceSettings';
import SetupWhatsApp from '@/pages/SetupWhatsApp';
import Manual from '@/pages/Manual';

// Components
import { Toaster } from '@/components/ui/toaster';

// Context
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/hooks/use-toast';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <ThemeProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/chats" element={<Chats />} />
                <Route path="/chats/:id" element={<ChatDetail />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/ai-profiles" element={<AIProfiles />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/training" element={<Training />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/voice-settings" element={<VoiceSettings />} />
                <Route path="/setup-whatsapp" element={<SetupWhatsApp />} />
                <Route path="/manual" element={<Manual />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
            <Toaster />
          </ThemeProvider>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
