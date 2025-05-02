import React, { useState } from 'react';
import axios from 'axios';
import DashboardLayout from '@/components/layout/DashboardLayout';
import VoiceSettingsForm from '@/components/settings/VoiceSettingsForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getApiKeys } from '@/services/supabase';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Loader2 } from 'lucide-react';

const VoiceSettings = () => {
  const { data: apiKeys, isLoading: isApiKeysLoading } = useQuery({
    queryKey: ['apiKeys'],
    queryFn: getApiKeys,
  });

  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if both ElevenLabs and an AI provider key exist
  const hasElevenLabsKey = !isApiKeysLoading && apiKeys && apiKeys['elevenlabs_key']?.value;
  const hasAIProviderKey = !isApiKeysLoading && apiKeys && (
    apiKeys['openai_key']?.value || apiKeys['gemini_key']?.value
  );

  const fetchElevenLabsSettings = async () => {
    if (!hasElevenLabsKey) {
      setError('ElevenLabs API key is missing. Please set it up in the API Keys settings.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const apiKey = apiKeys['elevenlabs_key'].value;
      const response = await axios.get('https://api.elevenlabs.io/agent/settings', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });
      setSettings(response.data);
    } catch (err) {
      console.error('Error fetching ElevenLabs settings:', err);
      setError('Failed to fetch ElevenLabs settings. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 bg-gray-100 p-6 rounded-lg">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Voice Settings</h1>
          <p className="text-gray-600">Configure how your AI assistant speaks in WhatsApp calls.</p>
        </div>

        {!hasElevenLabsKey || !hasAIProviderKey ? (
          <Card className="border-amber-400 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center text-amber-600">
                <AlertCircle className="h-5 w-5 mr-2" />
                Missing API Keys
              </CardTitle>
              <CardDescription className="text-amber-500">
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
              <p className="text-sm text-amber-500 mb-4">
                Go to API Keys settings to add the required keys before configuring voice settings.
              </p>
              <button 
                onClick={() => window.location.href = '/settings?tab=api'}
                className="bg-amber-200 hover:bg-amber-300 text-gray-900 px-4 py-2 rounded-md text-sm"
              >
                Go to API Keys Settings
              </button>
            </CardContent>
          </Card>
        ) : (
          <>
            <VoiceSettingsForm />
            <Card className="border-gray-300 bg-white">
              <CardHeader>
                <CardTitle className="text-gray-900">ElevenLabs AI Agent Settings</CardTitle>
                <CardDescription className="text-gray-600">
                  Fetch the settings for your ElevenLabs conversational AI agent.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <button
                  onClick={fetchElevenLabsSettings}
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Fetching...
                    </span>
                  ) : (
                    'Fetch AI Agent Settings'
                  )}
                </button>
                {error && (
                  <p className="text-sm text-red-600 mt-4">{error}</p>
                )}
                {settings && (
                  <pre className="mt-4 p-4 bg-gray-100 rounded-lg text-gray-900 text-sm overflow-auto">
                    {JSON.stringify(settings, null, 2)}
                  </pre>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default VoiceSettings;