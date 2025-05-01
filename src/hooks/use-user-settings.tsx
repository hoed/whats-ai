
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { syncUserSettings } from '@/services/supabase';

interface UserSettings {
  dark_mode: boolean;
  notifications: boolean;
  language: string;
  voice_id?: string;
  voice_model?: string;
  ai_provider?: 'openai' | 'gemini';
  auto_voice_responses?: boolean;
  stability?: number;
  similarity_boost?: number;
}

export function useUserSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings>({
    dark_mode: false,
    notifications: true,
    language: 'id',
    voice_id: 'TX3LPaxmHKxFdv7VOQHJ',
    voice_model: 'eleven_multilingual_v2',
    ai_provider: 'openai',
    auto_voice_responses: true,
    stability: 0.5,
    similarity_boost: 0.5,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load user settings from Supabase
  useEffect(() => {
    const loadUserSettings = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // First, ensure the user has settings
        await syncUserSettings(user.id);
        
        // Then load settings
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setSettings({
            dark_mode: data.dark_mode || false,
            notifications: data.notifications || true,
            language: data.language || 'id',
            voice_id: data.voice_id || 'TX3LPaxmHKxFdv7VOQHJ',
            voice_model: data.voice_model || 'eleven_multilingual_v2',
            ai_provider: (data.ai_provider as 'openai' | 'gemini') || 'openai',
            auto_voice_responses: data.auto_voice_responses !== undefined ? data.auto_voice_responses : true,
            stability: data.stability !== undefined ? Number(data.stability) : 0.5,
            similarity_boost: data.similarity_boost !== undefined ? Number(data.similarity_boost) : 0.5,
          });
        }
      } catch (error: any) {
        console.error('Error loading user settings:', error);
        toast({
          title: "Error",
          description: "Failed to load user settings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserSettings();
  }, [user, toast]);

  // Function to update user settings
  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_settings')
        .update({
          ...newSettings,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setSettings(prev => ({
        ...prev,
        ...newSettings
      }));
      
      toast({
        title: "Settings Updated",
        description: "Your settings have been saved successfully",
      });
      
    } catch (error: any) {
      console.error('Error updating user settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    }
  };

  return {
    settings,
    isLoading,
    updateSettings,
  };
}
