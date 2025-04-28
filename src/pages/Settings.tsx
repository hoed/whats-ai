
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import APIKeyForm from '@/components/settings/APIKeyForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-500">Manage your account settings and integrations</p>
        </div>
        
        <Tabs defaultValue="api" className="w-full">
          <TabsList className="w-full max-w-md">
            <TabsTrigger value="api" className="flex-1">API Keys</TabsTrigger>
            <TabsTrigger value="whatsapp" className="flex-1">WhatsApp</TabsTrigger>
            <TabsTrigger value="general" className="flex-1">General</TabsTrigger>
          </TabsList>
          
          <TabsContent value="api" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <APIKeyForm
                title="OpenAI API Key"
                description="Required for AI-powered conversations."
                apiKeyLabel="OpenAI API Key"
                apiKeyName="openai_key"
                apiKeyPlaceholder="sk-..."
              />
              
              <APIKeyForm
                title="WhatsApp API Credentials"
                description="Connect to the WhatsApp Business API."
                apiKeyLabel="WhatsApp API Token"
                apiKeyName="whatsapp_token"
                apiKeyPlaceholder="Enter your WhatsApp API token"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="whatsapp" className="mt-6">
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-lg font-medium mb-4">WhatsApp Connection Settings</h2>
              <p className="text-gray-500 mb-6">
                Configure your WhatsApp Business API connection. Please connect your WhatsApp
                account in the API Keys tab first.
              </p>
              
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-amber-800 mb-6">
                <h3 className="font-medium mb-1">WhatsApp API Not Connected</h3>
                <p className="text-sm">
                  Please add your WhatsApp API credentials in the API Keys tab
                  before configuring these settings.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="general" className="mt-6">
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-lg font-medium mb-4">General Settings</h2>
              <p className="text-gray-500 mb-6">
                Configure general application settings and preferences.
              </p>
              
              <p className="text-sm text-gray-500">
                General settings will be available soon.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
