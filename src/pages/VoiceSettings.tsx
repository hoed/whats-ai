import React, { useState } from 'react';
import axios from 'axios';
import DashboardLayout from '@/components/layout/DashboardLayout';
import VoiceSettingsForm from '@/components/settings/VoiceSettingsForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getApiKeys } from '@/services/supabase';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

// Define type for apiKeys to simplify inference
type ApiKeys = Record<string, { value: string }>;

// Type for webhook events
type WebhookEvent = Database['public']['Tables']['webhook_events']['Row'];

const VoiceSettings = () => {
  const { data: apiKeys, isLoading: isApiKeysLoading, error: apiKeysError, refetch: refetchApiKeys } = useQuery<
    ApiKeys,
    Error
  >({
    queryKey: ['apiKeys'],
    queryFn: getApiKeys,
  });

  const { data: webhookEvents, isLoading: isWebhookLoading, refetch: refetchWebhookEvents } = useQuery<
    WebhookEvent[] | undefined,
    Error
  >({
    queryKey: ['webhookEvents'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user found");

      const { data, error } = await supabase
        .from('webhook_events')
        .select('*')
        .eq('user_id', user.id)
        .eq('event_type', 'elevenlabs_webhook')
        .order('received_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data as WebhookEvent[];
    },
    enabled: !isApiKeysLoading && !!apiKeys && !apiKeysError,
  });

  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Enhanced debug logs
  console.log('apiKeys:', apiKeys);
  console.log('apiKeys.elevenlabs_key:', apiKeys?.['elevenlabs_key']);
  console.log('apiKeys.openai_key:', apiKeys?.['openai_key']);
  console.log('apiKeys.gemini_key:', apiKeys?.['gemini_key']);
  console.log('isApiKeysLoading:', isApiKeysLoading);
  console.log('apiKeysError:', apiKeysError);

  const hasElevenLabsKey = !isApiKeysLoading && apiKeys && apiKeys['elevenlabs_key']?.value;
  const hasAIProviderKey = !isApiKeysLoading && apiKeys && (
    apiKeys['openai_key']?.value || apiKeys['gemini_key']?.value
  );

  console.log('hasElevenLabsKey:', hasElevenLabsKey);
  console.log('hasAIProviderKey:', hasAIProviderKey);

  const fetchElevenLabsSettings = async () => {
    if (!hasElevenLabsKey) {
      setError('ElevenLabs API key is missing. Please set it up in the API Keys settings.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const apiKey = apiKeys!['elevenlabs_key'].value;
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

        {isApiKeysLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
            <span className="ml-2 text-gray-600">Loading API keys...</span>
          </div>
        ) : apiKeysError ? (
          <Card className="border-red-400 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <AlertCircle className="h-5 w-5 mr-2" />
                Error Loading API Keys
              </CardTitle>
              <CardDescription className="text-red-500">
                Failed to load API keys: {apiKeysError.message}
              </CardDescription>
            </CardHeader>
          </Card>
        ) : !hasElevenLabsKey || !hasAIProviderKey ? (
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
                className="bg-amber-200 hover:bg-amber-300 text-gray-900 px-4 py-2 rounded-md text-sm mr-2"
              >
                Go to API Keys Settings
              </button>
              <button 
                onClick={() => refetchApiKeys()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
              >
                Refresh API Keys
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
            <Card className="border-gray-300 bg-white">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center justify-between">
                  ElevenLabs Webhook Events
                  <button
                    onClick={() => refetchWebhookEvents()}
                    disabled={isWebhookLoading}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <RefreshCw className={`h-4 w-4 ${isWebhookLoading ? 'animate-spin' : ''}`} />
                  </button>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  View recent webhook events received from ElevenLabs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isWebhookLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span>Loading webhook events...</span>
                  </div>
                ) : webhookEvents && webhookEvents.length > 0 ? (
                  <div className="space-y-4">
                    {webhookEvents.map(event => (
                      <div key={event.id} className="border border-gray-200 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">
                          Received at: {new Date(event.received_at).toLocaleString()}
                        </p>
                        <pre className="mt-2 p-2 bg-gray-100 rounded-lg text-gray-900 text-sm overflow-auto">
                          {JSON.stringify(event.payload, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No webhook events received yet.</p>
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