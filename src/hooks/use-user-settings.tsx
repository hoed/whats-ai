
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { syncUserSettings } from '@/services/supabase';

interface UserSettings {
  dark_mode: boolean;
  notifications: boolean;
  language: string;
}

export function useUserSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings>({
    dark_mode: false,
    notifications: true,
    language: 'id',
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
