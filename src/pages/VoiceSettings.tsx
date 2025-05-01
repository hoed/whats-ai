import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import VoiceSettingsForm from '@/components/settings/VoiceSettingsForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getApiKeys } from '@/services/supabase';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';

const VoiceSettings = () => {
  const { data: apiKeys, isLoading } = useQuery({
    queryKey: ['apiKeys'],
    queryFn: getApiKeys
  });

  // Check if both ElevenLabs and an AI provider key exist
  const hasElevenLabsKey = !isLoading && apiKeys && apiKeys['elevenlabs_key']?.value;
  const hasAIProviderKey = !isLoading && apiKeys && (
    apiKeys['openai_key']?.value || apiKeys['gemini_key']?.value
  );
  
  return (
    <DashboardLayout>
      <div className="space-y-6 bg-gray-800 p-6 rounded-lg">
        <div>
          <h1 className="text-2xl font-bold text-white">Voice Settings</h1>
          <p className="text-gray-300">Configure how your AI assistant speaks in WhatsApp calls.</p>
        </div>
        
        {!hasElevenLabsKey || !hasAIProviderKey ? (
          <Card className="border-amber-700 bg-gray-900">
            <CardHeader>
              <CardTitle className="flex items-center text-amber-500">
                <AlertCircle className="h-5 w-5 mr-2" />
                Missing API Keys
              </CardTitle>
              <CardDescription className="text-amber-400">
                {!hasElevenLabsKey && !hasAIProviderKey ? (
                  "You need to set up both ElevenLabs and an AI provider (OpenAI or Gemini) API keys first."
                ) : !hasElevenLabsKey ? (
                  "You need to set up your ElevenLabs API key first."
                ) : (
                  "You need to set up either OpenAI or Gemini API key first."
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-amber-400 mb-4">
                Go to API Keys settings to add the required keys before configuring voice settings.
              </p>
              <button 
                onClick={() => window.location.href = '/settings?tab=api'}
                className="bg-amber-700 hover:bg-amber-600 text-white px-4 py-2 rounded-md text-sm"
              >
                Go to API Keys Settings
              </button>
            </CardContent>
          </Card>
        ) : (
          <VoiceSettingsForm />
        )}
      </div>
    </DashboardLayout>
  );
};

export default VoiceSettings;