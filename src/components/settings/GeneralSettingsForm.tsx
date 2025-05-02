
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Monitor, Moon, Bell, Languages } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserSettings } from '@/hooks/use-user-settings';

const GeneralSettingsForm: React.FC = () => {
  const { settings, updateSettings, isLoading } = useUserSettings();
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('id');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { darkMode, toggleTheme } = useTheme();
  
  useEffect(() => {
    if (!isLoading && settings) {
      setNotifications(settings.notifications);
      setLanguage(settings.language || 'id');
    }
  }, [settings, isLoading]);
  
  const saveSettings = async () => {
    setSaving(true);
    
    try {
      await updateSettings({
        notifications: notifications,
        language: language,
      });
      
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
        <div className="flex items-center justify-between bg-slate-900/50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-800 dark:bg-slate-700 rounded-full">
              {darkMode ? <Moon className="h-5 w-5 text-blue-400" /> : <Monitor className="h-5 w-5 text-amber-400" />}
            </div>
            <div>
              <Label className="text-slate-300 dark:text-slate-200">Mode Gelap</Label>
              <p className="text-xs text-slate-400 dark:text-slate-300">Aktifkan mode gelap untuk tampilan aplikasi</p>
            </div>
          </div>
          <Switch
            checked={darkMode}
            onCheckedChange={toggleTheme}
            className="data-[state=checked]:bg-cyan-600"
          />
        </div>
        
        <div className="flex items-center justify-between bg-slate-900/50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-800 dark:bg-slate-700 rounded-full">
              <Bell className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <Label className="text-slate-300 dark:text-slate-200">Notifikasi</Label>
              <p className="text-xs text-slate-400 dark:text-slate-300">Aktifkan notifikasi untuk pesan baru</p>
            </div>
          </div>
          <Switch
            checked={notifications}
            onCheckedChange={setNotifications}
            className="data-[state=checked]:bg-cyan-600"
          />
        </div>
        
        <div className="flex items-center justify-between bg-slate-900/50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-800 dark:bg-slate-700 rounded-full">
              <Languages className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <Label className="text-slate-300 dark:text-slate-200">Bahasa</Label>
              <p className="text-xs text-slate-400 dark:text-slate-300">Pilih bahasa tampilan aplikasi</p>
            </div>
          </div>
          <Select
            value={language}
            onValueChange={setLanguage}
          >
            <SelectTrigger className="w-[120px] bg-slate-800 dark:bg-slate-700 border-slate-600">
              <SelectValue placeholder="Bahasa" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 dark:bg-slate-700 border-slate-600">
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
