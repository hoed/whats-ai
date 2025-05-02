import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Loader2, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUserSettings } from '@/hooks/use-user-settings';
import { saveElevenLabsKey } from '@/services/supabase';

interface VoiceSettings {
  voice_id: string;
  voice_model: string;
  ai_provider: 'openai' | 'gemini';
  auto_voice_responses: boolean;
  stability: number;
  similarity_boost: number;
}

const predefinedVoices = [
  { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam', description: 'Confident and Friendly Male' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', description: 'Professional Female' },
  { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte', description: 'Natural Female' },
  { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie', description: 'Casual Male' },
  { id: 'bIHbv24MWmeRgasZH58o', name: 'Will', description: 'Warm Male' },
];

const VoiceSettingsForm = () => {
  const { settings, updateSettings, isLoading } = useUserSettings();
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    voice_id: 'TX3LPaxmHKxFdv7VOQHJ', // Default to Liam voice
    voice_model: 'eleven_multilingual_v2',
    ai_provider: 'openai',
    auto_voice_responses: true,
    stability: 0.5,
    similarity_boost: 0.5,
  });
  
  const [saving, setSaving] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { toast } = useToast();

  // Save ElevenLabs API key on component mount
  useEffect(() => {
    const saveApiKey = async () => {
      try {
        // Pass a placeholder argument since the function likely needs at least one argument
        await saveElevenLabsKey("elevenlabs_key");
      } catch (error) {
        console.error('Error saving ElevenLabs API key:', error);
      }
    };
    saveApiKey();
  }, []);
  
  // Load voice settings from user settings
  useEffect(() => {
    if (!isLoading && settings) {
      setVoiceSettings({
        voice_id: settings.voice_id || voiceSettings.voice_id,
        voice_model: settings.voice_model || voiceSettings.voice_model,
        ai_provider: (settings.ai_provider as 'openai' | 'gemini') || voiceSettings.ai_provider,
        auto_voice_responses: settings.auto_voice_responses !== undefined ? settings.auto_voice_responses : voiceSettings.auto_voice_responses,
        stability: settings.stability !== undefined ? settings.stability : voiceSettings.stability,
        similarity_boost: settings.similarity_boost !== undefined ? settings.similarity_boost : voiceSettings.similarity_boost,
      });
    }
  }, [settings, isLoading]);
  
  // Save settings to user settings
  const handleSave = async () => {
    try {
      setSaving(true);
      await updateSettings(voiceSettings);
      
      toast({
        title: 'Success',
        description: 'Voice settings saved successfully.',
      });
    } catch (error: any) {
      console.error('Error saving voice settings:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save voice settings.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Test voice using the text-to-speech edge function
  const testVoice = async () => {
    try {
      setAudioPlaying(true);
      
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: "This is a test of the ElevenLabs voice synthesis. How does it sound?",
          voiceId: voiceSettings.voice_id,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }
      
      const data = await response.json();
      
      // Create audio from base64
      const audioSrc = `data:audio/mp3;base64,${data.audio}`;
      setAudioUrl(audioSrc);
      
      // Play the audio
      const audio = new Audio(audioSrc);
      audio.play();
      
      audio.onended = () => {
        setAudioPlaying(false);
      };
      
    } catch (error: any) {
      console.error('Error testing voice:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to test voice.',
        variant: 'destructive',
      });
      setAudioPlaying(false);
    }
  };
  
  if (isLoading) {
    return (
      <Card className="border border-blue-900/20 bg-blue-950/5 backdrop-blur-sm dark:border-blue-800/30 dark:bg-blue-900/10">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="border border-blue-900/20 bg-blue-950/5 backdrop-blur-sm dark:border-blue-800/30 dark:bg-blue-900/10">
      <CardHeader>
        <CardTitle className="text-xl text-blue-100 dark:text-blue-50">Voice Settings</CardTitle>
        <CardDescription className="text-blue-200/70 dark:text-blue-200/60">
          Configure how your AI assistant sounds when responding to WhatsApp calls.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="ai-provider" className="text-blue-100 dark:text-blue-50">AI Provider</Label>
          <Select 
            value={voiceSettings.ai_provider} 
            onValueChange={(value) => setVoiceSettings({...voiceSettings, ai_provider: value as 'openai' | 'gemini'})}
          >
            <SelectTrigger className="bg-blue-950/30 border-blue-900/50 text-blue-100 dark:bg-blue-900/50 dark:border-blue-800/50 dark:text-blue-50">
              <SelectValue placeholder="Select AI Provider" />
            </SelectTrigger>
            <SelectContent className="dark:bg-slate-800">
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="gemini">Google Gemini</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-blue-200/70 dark:text-blue-200/60">
            Choose which AI provider to use for generating responses.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="voice-selection" className="text-blue-100 dark:text-blue-50">Voice</Label>
          <Select 
            value={voiceSettings.voice_id} 
            onValueChange={(value) => setVoiceSettings({...voiceSettings, voice_id: value})}
          >
            <SelectTrigger className="bg-blue-950/30 border-blue-900/50 text-blue-100 dark:bg-blue-900/50 dark:border-blue-800/50 dark:text-blue-50">
              <SelectValue placeholder="Select Voice" />
            </SelectTrigger>
            <SelectContent className="dark:bg-slate-800">
              {predefinedVoices.map((voice) => (
                <SelectItem key={voice.id} value={voice.id}>
                  {voice.name} - {voice.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2 mt-2">
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="bg-blue-950/30 hover:bg-blue-900/40 border-blue-900/50 text-blue-100 dark:bg-blue-900/40 dark:hover:bg-blue-800/50 dark:border-blue-800/50 dark:text-blue-50"
              onClick={testVoice}
              disabled={audioPlaying}
            >
              {audioPlaying ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Test Voice
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="voice-model" className="text-blue-100 dark:text-blue-50">Voice Model</Label>
          <Select 
            value={voiceSettings.voice_model} 
            onValueChange={(value) => setVoiceSettings({...voiceSettings, voice_model: value})}
          >
            <SelectTrigger className="bg-blue-950/30 border-blue-900/50 text-blue-100 dark:bg-blue-900/50 dark:border-blue-800/50 dark:text-blue-50">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent className="dark:bg-slate-800">
              <SelectItem value="eleven_multilingual_v2">Multilingual V2 (High Quality)</SelectItem>
              <SelectItem value="eleven_turbo_v2">Turbo V2 (Faster)</SelectItem>
              <SelectItem value="eleven_monolingual_v1">English V1 (Legacy)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-blue-200/70 dark:text-blue-200/60">
            Higher quality models produce better speech but may be slower.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="stability" className="text-blue-100 dark:text-blue-50">Stability</Label>
              <span className="text-sm text-blue-300 dark:text-blue-200">{Math.round(voiceSettings.stability * 100)}%</span>
            </div>
            <Slider
              id="stability"
              min={0}
              max={1}
              step={0.05}
              value={[voiceSettings.stability]}
              onValueChange={(value) => setVoiceSettings({...voiceSettings, stability: value[0]})}
              className="w-full"
            />
            <p className="text-xs text-blue-200/70 dark:text-blue-200/60">
              Higher stability makes the voice more consistent but less expressive.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="similarity" className="text-blue-100 dark:text-blue-50">Similarity Boost</Label>
              <span className="text-sm text-blue-300 dark:text-blue-200">{Math.round(voiceSettings.similarity_boost * 100)}%</span>
            </div>
            <Slider
              id="similarity"
              min={0}
              max={1}
              step={0.05}
              value={[voiceSettings.similarity_boost]}
              onValueChange={(value) => setVoiceSettings({...voiceSettings, similarity_boost: value[0]})}
              className="w-full"
            />
            <p className="text-xs text-blue-200/70 dark:text-blue-200/60">
              Higher values make the voice sound more like the reference.
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="auto-voice"
            checked={voiceSettings.auto_voice_responses}
            onCheckedChange={(checked) => setVoiceSettings({...voiceSettings, auto_voice_responses: checked})}
          />
          <Label htmlFor="auto-voice" className="text-blue-100 dark:text-blue-50">
            Auto-convert AI responses to voice in WhatsApp calls
          </Label>
        </div>
        
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : "Save Voice Settings"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default VoiceSettingsForm;
