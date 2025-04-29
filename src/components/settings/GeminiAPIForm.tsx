
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const GeminiAPIForm: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Kesalahan",
        description: "Silakan masukkan API key Gemini yang valid",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Save to Supabase user metadata
      const { error } = await supabase
        .from('api_keys')
        .upsert(
          { 
            key_name: 'gemini_key',
            key_value: apiKey,
            created_at: new Date().toISOString()
          },
          { onConflict: 'key_name' }
        );
      
      if (error) throw error;
      
      setIsSaved(true);
      setIsVisible(false);
      
      toast({
        title: "API Key Tersimpan",
        description: "API Key Gemini Anda telah berhasil disimpan.",
      });
    } catch (error: any) {
      toast({
        title: "Kesalahan",
        description: error.message || "Gagal menyimpan API key",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Key Gemini</CardTitle>
        <CardDescription>Diperlukan untuk percakapan AI yang menggunakan Gemini.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="gemini_key">Gemini API Key</Label>
            <div className="flex items-center">
              <Input
                id="gemini_key"
                type={isVisible ? "text" : "password"}
                placeholder="AIza..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                className="ml-2"
                onClick={() => setIsVisible(!isVisible)}
              >
                {isVisible ? "Sembunyikan" : "Tampilkan"}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              {isSaved ? (
                <span className="flex items-center text-green-500">
                  <Check className="h-4 w-4 mr-1" /> API Key telah diatur
                </span>
              ) : (
                "API key akan disimpan dengan aman di Supabase."
              )}
            </p>
          </div>
          <Button onClick={handleSave} className="w-full" disabled={isLoading}>
            {isLoading ? "Menyimpan..." : isSaved ? "Perbarui API Key" : "Simpan API Key"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeminiAPIForm;
