
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GeneralSettingsForm from '@/components/settings/GeneralSettingsForm';
import APIKeysForm from '@/components/settings/APIKeysForm';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';

const Settings = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  // Define classes based on dark mode
  const bgClass = darkMode ? 'bg-slate-900' : 'bg-gray-200';
  const textClass = darkMode ? 'text-white' : 'text-gray-900';
  const tabsBgClass = darkMode ? 'bg-slate-800' : 'bg-gray-300';
  const tabsDataClass = darkMode 
    ? 'data-[state=active]:bg-slate-700 data-[state=active]:text-white' 
    : 'data-[state=active]:bg-white data-[state=active]:text-gray-900';
  const buttonClass = darkMode
    ? 'bg-slate-800 hover:bg-slate-700 text-gray-200 border-slate-600'
    : 'bg-white hover:bg-gray-50 text-gray-900 border-gray-300';
  const dangerZoneBgClass = darkMode ? 'bg-slate-800' : 'bg-white';
  const dangerZoneCardBorderClass = darkMode ? 'border-red-900' : 'border-red-400';
  const dangerZoneTextClass = darkMode ? 'text-red-400' : 'text-red-800';
  const dangerZoneSubtextClass = darkMode ? 'text-red-400/80' : 'text-red-700';
  const dangerItemBgClass = darkMode ? 'bg-slate-900' : 'bg-gray-100';
  const dangerButtonClass = darkMode 
    ? 'bg-red-800 hover:bg-red-700' 
    : 'bg-red-600 hover:bg-red-500';

  return (
    <DashboardLayout>
      <div className={`space-y-6 ${bgClass} p-6 rounded-lg`}>
        <div>
          <h1 className={`text-2xl font-bold ${textClass}`}>Settings</h1>
          <p className={textClass}>Manage your application settings and preferences.</p>
        </div>
        
        <Tabs defaultValue="general">
          <TabsList className={`grid w-full grid-cols-3 ${tabsBgClass}`}>
            <TabsTrigger value="general" className={`text-gray-700 ${tabsDataClass}`}>General</TabsTrigger>
            <TabsTrigger value="api" className={`text-gray-700 ${tabsDataClass}`}>API Keys</TabsTrigger>
            <TabsTrigger value="advanced" className={`text-gray-700 ${tabsDataClass}`}>Advanced</TabsTrigger>
          </TabsList>
          
          <div className="flex justify-end mt-4">
            <Button 
              onClick={() => navigate('/voice-settings')}
              variant="outline" 
              className={`flex items-center gap-2 ${buttonClass}`}
            >
              <Mic className="h-4 w-4" />
              Voice Settings
            </Button>
          </div>
          
          <TabsContent value="general" className="mt-6">
            <GeneralSettingsForm />
          </TabsContent>
          
          <TabsContent value="api" className="mt-6 space-y-6">
            <APIKeysForm />
          </TabsContent>
          
          <TabsContent value="advanced" className="mt-6">
            <div className={`rounded-lg border ${dangerZoneCardBorderClass} ${dangerZoneBgClass} p-6`}>
              <h2 className={`text-lg font-medium ${dangerZoneTextClass}`}>Danger Zone</h2>
              <p className={`mt-1 text-sm ${dangerZoneSubtextClass}`}>These actions are irreversible. Please proceed with caution.</p>
              
              <div className="mt-6 space-y-4">
                <div className={`flex items-center justify-between rounded-lg border ${dangerZoneCardBorderClass} ${dangerItemBgClass} p-4`}>
                  <div>
                    <h3 className={`font-medium ${dangerZoneTextClass}`}>Delete All Chat History</h3>
                    <p className={`text-sm ${dangerZoneSubtextClass}`}>This will permanently delete all chat history for all contacts.</p>
                  </div>
                  <button className={`rounded-md ${dangerButtonClass} px-4 py-2 text-sm font-medium text-white transition-colors`}>
                    Delete History
                  </button>
                </div>
                
                <div className={`flex items-center justify-between rounded-lg border ${dangerZoneCardBorderClass} ${dangerItemBgClass} p-4`}>
                  <div>
                    <h3 className={`font-medium ${dangerZoneTextClass}`}>Reset Application</h3>
                    <p className={`text-sm ${dangerZoneSubtextClass}`}>Reset all settings to their default values.</p>
                  </div>
                  <button className={`rounded-md ${dangerButtonClass} px-4 py-2 text-sm font-medium text-white transition-colors`}>
                    Reset App
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
