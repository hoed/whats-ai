
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import APIKeyForm from '@/components/settings/APIKeyForm';
import { useToast } from '@/components/ui/use-toast';
import { getApiKeys, saveApiKey } from '@/services/supabase';
import { Database } from '@/integrations/supabase/types';
import { useTheme } from '@/contexts/ThemeContext';

type ApiKeyRecord = Record<string, { value: string; type: string }>;

const APIKeysForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord>({});
  const { toast } = useToast();
  const { darkMode } = useTheme();

  // Load API keys from Supabase on component mount
  useEffect(() => {
    const loadApiKeys = async () => {
      try {
        setIsLoading(true);
        const keys = await getApiKeys();
        setApiKeys(keys);
      } catch (error: any) {
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
      toast({
        title: "Error",
        description: error.message || "Failed to save API key",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Use different classes based on darkMode
  const headerTextClass = darkMode ? "text-white" : "text-gray-900";
  const descriptionTextClass = darkMode ? "text-gray-300" : "text-gray-600";
  
  return (
    <Card className={darkMode ? "border-blue-800 bg-slate-800" : "border-blue-200 bg-white"}>
      <CardHeader>
        <CardTitle className={`text-xl ${headerTextClass}`}>API Keys</CardTitle>
        <CardDescription className={descriptionTextClass}>
          Configure your API keys for various services.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="whatsapp">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            <TabsTrigger value="openai">OpenAI</TabsTrigger>
            <TabsTrigger value="gemini">Gemini</TabsTrigger>
            <TabsTrigger value="elevenlabs">ElevenLabs</TabsTrigger>
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
