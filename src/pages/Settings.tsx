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
      <div className="space-y-6 bg-gray-800 p-6 rounded-lg">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-300">Manage your application settings and preferences.</p>
        </div>
        
        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-3 bg-gray-700">
            <TabsTrigger value="general" className="text-white data-[state=active]:bg-gray-600 data-[state=active]:text-white">General</TabsTrigger>
            <TabsTrigger value="api" className="text-white data-[state=active]:bg-gray-600 data-[state=active]:text-white">API Keys</TabsTrigger>
            <TabsTrigger value="advanced" className="text-white data-[state=active]:bg-gray-600 data-[state=active]:text-white">Advanced</TabsTrigger>
          </TabsList>
          
          <div className="flex justify-end mt-4">
            <Button 
              onClick={() => navigate('/voice-settings')}
              variant="outline" 
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white border-gray-500"
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
            <div className="rounded-lg border border-red-700 bg-gray-900 p-6">
              <h2 className="text-lg font-medium text-red-500">Danger Zone</h2>
              <p className="mt-1 text-sm text-red-400">These actions are irreversible. Please proceed with caution.</p>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-red-700 bg-gray-800 p-4">
                  <div>
                    <h3 className="font-medium text-red-500">Delete All Chat History</h3>
                    <p className="text-sm text-red-400">This will permanently delete all chat history for all contacts.</p>
                  </div>
                  <button className="rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors">
                    Delete History
                  </button>
                </div>
                
                <div className="flex items-center justify-between rounded-lg border border-red-700 bg-gray-800 p-4">
                  <div>
                    <h3 className="font-medium text-red-500">Reset Application</h3>
                    <p className="text-sm text-red-400">Reset all settings to their default values.</p>
                  </div>
                  <button className="rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors">
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