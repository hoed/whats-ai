
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const GeneralSettingsForm: React.FC = () => {
  const [language, setLanguage] = useState('id');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Fetch existing settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .maybeSingle();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching settings:', error);
          return;
        }
        
        if (data) {
          setLanguage(data.language || 'id');
          setDarkMode(data.dark_mode || false);
          setNotifications(data.notifications || true);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    fetchSettings();
  }, []);
  
  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    try {
      // Check if settings already exist
      const { data } = await supabase
        .from('user_settings')
        .select('id')
        .maybeSingle();
      
      let operation;
      
      if (data) {
        // Update existing settings
        operation = supabase
          .from('user_settings')
          .update({ 
            language,
            dark_mode: darkMode,
            notifications,
            updated_at: new Date().toISOString()
          })
          .eq('id', data.id);
      } else {
        // Insert new settings
        operation = supabase
          .from('user_settings')
          .insert({ 
            language,
            dark_mode: darkMode,
            notifications,
            updated_at: new Date().toISOString()
          });
      }
      
      const { error } = await operation;
      
      if (error) throw error;
      
      // Store language preference in local storage
      localStorage.setItem('language', language);
      
      toast({
        title: "Pengaturan Tersimpan",
        description: "Preferensi pengaturan Anda telah berhasil diperbarui.",
      });
    } catch (error: any) {
      toast({
        title: "Kesalahan",
        description: error.message || "Gagal menyimpan pengaturan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Preferensi Bahasa</h3>
          <p className="text-sm text-gray-500 mb-2">
            Pilih bahasa untuk antarmuka aplikasi
          </p>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full md:w-[240px]">
              <SelectValue placeholder="Pilih bahasa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="id">Bahasa Indonesia</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <h3 className="text-lg font-medium">Tema Tampilan</h3>
          <div className="flex items-center justify-between mt-2">
            <div>
              <Label htmlFor="dark-mode">Mode Gelap</Label>
              <p className="text-sm text-gray-500">
                Aktifkan mode gelap untuk tampilan yang lebih nyaman di malam hari
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium">Notifikasi</h3>
          <div className="flex items-center justify-between mt-2">
            <div>
              <Label htmlFor="notifications">Aktifkan Notifikasi</Label>
              <p className="text-sm text-gray-500">
                Dapatkan notifikasi saat ada pesan baru
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
        </div>
      </div>
      
      <Button onClick={handleSaveSettings} disabled={isLoading}>
        {isLoading ? "Menyimpan..." : "Simpan Pengaturan"}
      </Button>
    </div>
  );
};

export default GeneralSettingsForm;
