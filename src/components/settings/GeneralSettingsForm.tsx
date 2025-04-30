
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Monitor, Moon, Bell, Languages } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const GeneralSettingsForm: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('id');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // In a real app, get user ID from auth context
        const userId = "00000000-0000-0000-0000-000000000000"; // Placeholder user ID for demo
        
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching settings:', error);
          return;
        }
        
        if (data) {
          setDarkMode(data.dark_mode || false);
          setNotifications(data.notifications !== false); // Default to true if null
          setLanguage(data.language || 'id');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    fetchSettings();
  }, []);
  
  const saveSettings = async () => {
    setSaving(true);
    
    try {
      // In a real app, get user ID from auth context
      const userId = "00000000-0000-0000-0000-000000000000"; // Placeholder user ID for demo
      
      const { data: existingSettings } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      let operation;
      
      if (existingSettings) {
        // Update existing settings
        operation = supabase
          .from('user_settings')
          .update({
            dark_mode: darkMode,
            notifications: notifications,
            language: language,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
      } else {
        // Insert new settings
        operation = supabase
          .from('user_settings')
          .insert({
            user_id: userId,
            dark_mode: darkMode,
            notifications: notifications,
            language: language
          });
      }
      
      const { error } = await operation;
      
      if (error) throw error;
      
      toast({
        title: "Pengaturan disimpan",
        description: "Preferensi Anda telah berhasil diperbarui.",
      });
    } catch (error: any) {
      toast({
        title: "Kesalahan",
        description: error.message || "Gagal menyimpan pengaturan",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-800 rounded-full">
              {darkMode ? <Moon className="h-5 w-5 text-blue-400" /> : <Monitor className="h-5 w-5 text-amber-400" />}
            </div>
            <div>
              <Label className="text-slate-300">Mode Gelap</Label>
              <p className="text-xs text-slate-400">Aktifkan mode gelap untuk tampilan aplikasi</p>
            </div>
          </div>
          <Switch
            checked={darkMode}
            onCheckedChange={setDarkMode}
            className="data-[state=checked]:bg-cyan-600"
          />
        </div>
        
        <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-800 rounded-full">
              <Bell className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <Label className="text-slate-300">Notifikasi</Label>
              <p className="text-xs text-slate-400">Aktifkan notifikasi untuk pesan baru</p>
            </div>
          </div>
          <Switch
            checked={notifications}
            onCheckedChange={setNotifications}
            className="data-[state=checked]:bg-cyan-600"
          />
        </div>
        
        <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-800 rounded-full">
              <Languages className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <Label className="text-slate-300">Bahasa</Label>
              <p className="text-xs text-slate-400">Pilih bahasa tampilan aplikasi</p>
            </div>
          </div>
          <Select
            value={language}
            onValueChange={setLanguage}
          >
            <SelectTrigger className="w-[120px] bg-slate-800 border-slate-600">
              <SelectValue placeholder="Bahasa" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="id">Indonesia</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button 
        onClick={saveSettings} 
        disabled={saving}
        className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600"
      >
        {saving ? "Menyimpan..." : "Simpan Pengaturan"}
      </Button>
    </div>
  );
};

export default GeneralSettingsForm;
