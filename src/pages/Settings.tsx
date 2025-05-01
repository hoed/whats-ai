
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GeneralSettingsForm from '@/components/settings/GeneralSettingsForm';
import APIKeysForm from '@/components/settings/APIKeysForm';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-6 rounded-lg backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Settings</h1>
          <p className="text-gray-400">Manage your application settings and preferences.</p>
        </div>
        
        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <div className="flex justify-end mt-4">
            <Button 
              onClick={() => navigate('/voice-settings')}
              variant="outline" 
              className="flex items-center gap-2 bg-blue-900/20 hover:bg-blue-900/30 border-blue-700/30"
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
            <div className="rounded-lg border border-red-900/20 bg-red-950/5 p-6">
              <h2 className="text-lg font-medium text-red-400">Danger Zone</h2>
              <p className="mt-1 text-sm text-red-300/70">These actions are irreversible. Please proceed with caution.</p>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-red-900/20 bg-red-950/5 p-4">
                  <div>
                    <h3 className="font-medium text-red-300">Delete All Chat History</h3>
                    <p className="text-sm text-red-400/70">This will permanently delete all chat history for all contacts.</p>
                  </div>
                  <button className="rounded-md bg-red-900/30 px-4 py-2 text-sm font-medium text-red-200 hover:bg-red-800/40 transition-colors">
                    Delete History
                  </button>
                </div>
                
                <div className="flex items-center justify-between rounded-lg border border-red-900/20 bg-red-950/5 p-4">
                  <div>
                    <h3 className="font-medium text-red-300">Reset Application</h3>
                    <p className="text-sm text-red-400/70">Reset all settings to their default values.</p>
                  </div>
                  <button className="rounded-md bg-red-900/30 px-4 py-2 text-sm font-medium text-red-200 hover:bg-red-800/40 transition-colors">
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
