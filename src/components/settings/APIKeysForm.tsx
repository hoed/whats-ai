
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import APIKeyForm from '@/components/settings/APIKeyForm';
import { useToast } from '@/components/ui/use-toast';
import { getApiKeys, saveApiKey } from '@/services/supabase';

const APIKeysForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const { toast } = useToast();

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
    try {
      setIsLoading(true);
      await saveApiKey(keyName, keyValue);
      
      // Update local state
      setApiKeys(prev => ({
        ...prev,
        [keyName]: keyValue
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

  return (
    <Card className="border border-blue-900/20 bg-blue-950/5 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-blue-100">API Keys</CardTitle>
        <CardDescription className="text-blue-200/70">
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
              initialValue={apiKeys['whatsapp_key'] || ''}
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
              initialValue={apiKeys['openai_key'] || ''}
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
              initialValue={apiKeys['gemini_key'] || ''}
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
              initialValue={apiKeys['elevenlabs_key'] || ''}
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
