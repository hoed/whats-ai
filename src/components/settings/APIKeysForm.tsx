import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import APIKeyForm from '@/components/settings/APIKeyForm';
import { useToast } from '@/components/ui/use-toast';
import { getApiKeys, saveApiKey } from '@/services/supabase';
import { Database } from '@/integrations/supabase/types';
import TwilioAPIForm from '@/components/settings/TwilioAPIForm';

type ApiKeyRecord = Record<string, { value: string; type: string }>;

const APIKeysForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord>({});
  const { toast } = useToast();

  // Load API keys from Supabase on component mount
  useEffect(() => {
    const loadApiKeys = async () => {
      try {
        setIsLoading(true);
        const keys = await getApiKeys();
        console.log('Loaded API keys:', keys); // Debug log
        setApiKeys(keys);
      } catch (error: any) {
        console.error('Error loading API keys:', error);
        toast({
          title: "Error loading API keys",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadApiKeys();
  }, [toast]);

  const handleSaveApiKey = async (keyName: string, keyValue: string) => {
    // Extract the key type from the key name
    let keyType: Database['public']['Enums']['api_key_type'] = 'openai';
    
    if (keyName === 'whatsapp_key') keyType = 'whatsapp';
    else if (keyName === 'openai_key') keyType = 'openai';
    else if (keyName === 'gemini_key') keyType = 'gemini';
    else if (keyName === 'elevenlabs_key') keyType = 'elevenlabs';
    
    try {
      setIsLoading(true);
      await saveApiKey(keyName, keyValue, keyType);
      
      // Update local state
      setApiKeys(prev => ({
        ...prev,
        [keyName]: { value: keyValue, type: keyType }
      }));
      
      toast({
        title: "API Key Saved",
        description: `Your ${keyName} has been saved successfully.`,
      });
    } catch (error: any) {
      console.error('Error saving API key:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save API key",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-gray-300 bg-white">
      <CardHeader>
        <CardTitle className="text-xl text-gray-900">API Keys</CardTitle>
        <CardDescription className="text-gray-600">
          Configure your API keys for various services.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="whatsapp">
          <TabsList className="grid grid-cols-5 mb-8 bg-gray-300">
            <TabsTrigger value="whatsapp" className="text-gray-900 data-[state=active]:bg-white data-[state=active]:text-gray-900">WhatsApp</TabsTrigger>
            <TabsTrigger value="twilio" className="text-gray-900 data-[state=active]:bg-white data-[state=active]:text-gray-900">Twilio</TabsTrigger>
            <TabsTrigger value="openai" className="text-gray-900 data-[state=active]:bg-white data-[state=active]:text-gray-900">OpenAI</TabsTrigger>
            <TabsTrigger value="gemini" className="text-gray-900 data-[state=active]:bg-white data-[state=active]:text-gray-900">Gemini</TabsTrigger>
            <TabsTrigger value="elevenlabs" className="text-gray-900 data-[state=active]:bg-white data-[state=active]:text-gray-900">ElevenLabs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="whatsapp">
            <APIKeyForm
              title="WhatsApp Business API"
              description="Connect to WhatsApp Business API for customer engagement."
              apiKeyLabel="WhatsApp Business API Token"
              apiKeyName="whatsapp_key"
              apiKeyPlaceholder="Enter your WhatsApp Business API Token"
              initialValue={apiKeys['whatsapp_key']?.value || ''}
              onSave={(key) => handleSaveApiKey('whatsapp_key', key)}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="twilio">
            <TwilioAPIForm />
          </TabsContent>
          
          <TabsContent value="openai">
            <APIKeyForm
              title="OpenAI API"
              description="Power your AI conversations with OpenAI's GPT models."
              apiKeyLabel="OpenAI API Key"
              apiKeyName="openai_key"
              apiKeyPlaceholder="sk-..."
              initialValue={apiKeys['openai_key']?.value || ''}
              onSave={(key) => handleSaveApiKey('openai_key', key)}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="gemini">
            <APIKeyForm
              title="Google Gemini API"
              description="Alternative AI model from Google for content generation."
              apiKeyLabel="Gemini API Key"
              apiKeyName="gemini_key"
              apiKeyPlaceholder="Enter your Gemini API Key"
              initialValue={apiKeys['gemini_key']?.value || ''}
              onSave={(key) => handleSaveApiKey('gemini_key', key)}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="elevenlabs">
            <APIKeyForm
              title="ElevenLabs API"
              description="Convert text responses to natural-sounding speech."
              apiKeyLabel="ElevenLabs API Key"
              apiKeyName="elevenlabs_key"
              apiKeyPlaceholder="Enter your ElevenLabs API Key"
              initialValue={apiKeys['elevenlabs_key']?.value || ''}
              onSave={(key) => handleSaveApiKey('elevenlabs_key', key)}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default APIKeysForm;