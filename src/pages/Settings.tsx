
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import APIKeyForm from '@/components/settings/APIKeyForm';
import GeminiAPIForm from '@/components/settings/GeminiAPIForm';
import GeneralSettingsForm from '@/components/settings/GeneralSettingsForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Pengaturan</h1>
          <p className="text-gray-500">Kelola pengaturan akun dan integrasi Anda</p>
        </div>
        
        <Tabs defaultValue="api" className="w-full">
          <TabsList className="w-full max-w-md">
            <TabsTrigger value="api" className="flex-1">API Keys</TabsTrigger>
            <TabsTrigger value="whatsapp" className="flex-1">WhatsApp</TabsTrigger>
            <TabsTrigger value="general" className="flex-1">Umum</TabsTrigger>
          </TabsList>
          
          <TabsContent value="api" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <APIKeyForm
                title="OpenAI API Key"
                description="Diperlukan untuk percakapan yang didukung AI."
                apiKeyLabel="OpenAI API Key"
                apiKeyName="openai_key"
                apiKeyPlaceholder="sk-..."
              />
              
              <GeminiAPIForm />
              
              <APIKeyForm
                title="WhatsApp API Credentials"
                description="Hubungkan ke WhatsApp Business API."
                apiKeyLabel="WhatsApp API Token"
                apiKeyName="whatsapp_token"
                apiKeyPlaceholder="Masukkan token API WhatsApp Anda"
              />
              
              <APIKeyForm
                title="ElevenLabs API Key"
                description="Diperlukan untuk fitur text-to-speech."
                apiKeyLabel="ElevenLabs API Key"
                apiKeyName="elevenlabs_key"
                apiKeyPlaceholder="Masukkan API key ElevenLabs Anda"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="whatsapp" className="mt-6">
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-lg font-medium mb-4">Pengaturan Koneksi WhatsApp</h2>
              <p className="text-gray-500 mb-6">
                Konfigurasikan koneksi WhatsApp Business API Anda. Silakan hubungkan akun
                WhatsApp Anda di tab API Keys terlebih dahulu.
              </p>
              
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-amber-800 mb-6">
                <h3 className="font-medium mb-1">WhatsApp API Tidak Terhubung</h3>
                <p className="text-sm">
                  Silakan tambahkan kredensial WhatsApp API Anda di tab API Keys
                  sebelum mengkonfigurasi pengaturan ini.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="general" className="mt-6">
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-lg font-medium mb-4">Pengaturan Umum</h2>
              <p className="text-gray-500 mb-6">
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
