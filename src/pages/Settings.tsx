import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import APIKeyForm from '@/components/settings/APIKeyForm';
import GeminiAPIForm from '@/components/settings/GeminiAPIForm';
import GeneralSettingsForm from '@/components/settings/GeneralSettingsForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-4 rounded-lg backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Pengaturan</h1>
          <p className="text-gray-400">Kelola pengaturan akun dan integrasi Anda</p>
        </div>
        
        <Tabs defaultValue="api" className="w-full">
          <TabsList className="w-full max-w-md bg-gray-900/80 border-gray-600">
            <TabsTrigger value="api" className="flex-1 text-gray-100 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">API Keys</TabsTrigger>
            <TabsTrigger value="whatsapp" className="flex-1 text-gray-100 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">WhatsApp</TabsTrigger>
            <TabsTrigger value="general" className="flex-1 text-gray-100 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">Umum</TabsTrigger>
          </TabsList>
          
          <TabsContent value="api" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-600 bg-gray-900/80 backdrop-blur-sm shadow-lg hover:shadow-blue-400/20 transition-all duration-300 rounded-lg">
                <APIKeyForm
                  title="OpenAI API Key"
                  description="Diperlukan untuk percakapan yang didukung AI."
                  apiKeyLabel="OpenAI API Key"
                  apiKeyName="openai_key"
                  apiKeyPlaceholder="sk-..."
                />
              </div>
              
              <div className="border border-gray-600 bg-gray-900/80 backdrop-blur-sm shadow-lg hover:shadow-blue-400/20 transition-all duration-300 rounded-lg">
                <GeminiAPIForm />
              </div>
              
              <div className="border border-gray-600 bg-gray-900/80 backdrop-blur-sm shadow-lg hover:shadow-blue-400/20 transition-all duration-300 rounded-lg">
                <APIKeyForm
                  title="WhatsApp API Credentials"
                  description="Hubungkan ke WhatsApp Business API."
                  apiKeyLabel="WhatsApp API Token"
                  apiKeyName="whatsapp_token"
                  apiKeyPlaceholder="Masukkan token API WhatsApp Anda"
                />
              </div>
              
              <div className="border border-gray-600 bg-gray-900/80 backdrop-blur-sm shadow-lg hover:shadow-blue-400/20 transition-all duration-300 rounded-lg">
                <APIKeyForm
                  title="ElevenLabs API Key"
                  description="Diperlukan untuk fitur text-to-speech."
                  apiKeyLabel="ElevenLabs API Key"
                  apiKeyName="elevenlabs_key"
                  apiKeyPlaceholder="Masukkan API key ElevenLabs Anda"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="whatsapp" className="mt-6">
            <div className="border border-gray-600 bg-gray-900/80 backdrop-blur-sm p-6 rounded-lg shadow-lg hover:shadow-blue-400/20 transition-all duration-300">
              <h2 className="text-lg font-medium text-gray-100 mb-4">Pengaturan Koneksi WhatsApp</h2>
              <p className="text-gray-400 mb-6">
                Konfigurasikan koneksi WhatsApp Business API Anda. Silakan hubungkan akun
                WhatsApp Anda di tab API Keys terlebih dahulu.
              </p>
              
              <div className="rounded-lg bg-amber-900/20 border border-amber-700/50 p-4 text-amber-300 mb-6">
                <h3 className="font-medium mb-1 text-amber-300">WhatsApp API Tidak Terhubung</h3>
                <p className="text-sm text-amber-400">
                  Silakan tambahkan kredensial WhatsApp API Anda di tab API Keys
                  sebelum mengkonfigurasi pengaturan ini.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="general" className="mt-6">
            <div className="border border-gray-600 bg-gray-900/80 backdrop-blur-sm p-6 rounded-lg shadow-lg hover:shadow-blue-400/20 transition-all duration-300">
              <h2 className="text-lg font-medium text-gray-100 mb-4">Pengaturan Umum</h2>
              <p className="text-gray-400 mb-6">
                Konfigurasikan pengaturan dan preferensi aplikasi umum.
              </p>
              
              <GeneralSettingsForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;