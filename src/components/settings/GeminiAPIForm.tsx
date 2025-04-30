
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Check, CircuitBoard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const GeminiAPIForm: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Fetch existing API key on component mount
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const { data, error } = await supabase
          .from('api_keys')
          .select('key_value')
          .eq('key_name', 'gemini_key')
          .maybeSingle();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching API key:', error);
          return;
        }
        
        if (data) {
          setApiKey(data.key_value);
          setIsSaved(true);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    fetchApiKey();
  }, []);
  
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
      // Check if a key already exists
      const { data } = await supabase
        .from('api_keys')
        .select('id')
        .eq('key_name', 'gemini_key')
        .maybeSingle();
      
      let operation;
      
      if (data) {
        // Update existing key
        operation = supabase
          .from('api_keys')
          .update({ key_value: apiKey })
          .eq('key_name', 'gemini_key');
      } else {
        // Insert new key
        operation = supabase
          .from('api_keys')
          .insert({ 
            key_name: 'gemini_key',
            key_value: apiKey
          });
      }
      
      const { error } = await operation;
      
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
    <Card className="border-none bg-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="text-cyan-400 flex items-center gap-2">
          <CircuitBoard className="h-5 w-5" />
          API Key Gemini
        </CardTitle>
        <CardDescription className="text-slate-400">Diperlukan untuk percakapan AI yang menggunakan Gemini.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="gemini_key" className="text-slate-300">Gemini API Key</Label>
            <div className="flex items-center">
              <Input
                id="gemini_key"
                type={isVisible ? "text" : "password"}
                placeholder="AIza..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-slate-700 border-slate-600 focus:border-cyan-500"
              />
              <Button
                type="button"
                variant="outline"
                className="ml-2 border-slate-600 hover:bg-slate-700 text-slate-300"
                onClick={() => setIsVisible(!isVisible)}
              >
                {isVisible ? "Sembunyikan" : "Tampilkan"}
              </Button>
            </div>
            <p className="text-xs text-slate-400">
              {isSaved ? (
                <span className="flex items-center text-green-400">
                  <Check className="h-4 w-4 mr-1" /> API Key telah diatur
                </span>
              ) : (
                "API key akan disimpan dengan aman di Supabase."
              )}
            </p>
          </div>
          <Button 
            onClick={handleSave} 
            className={`w-full ${isSaved 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600'}`} 
            disabled={isLoading}
          >
            {isLoading ? "Menyimpan..." : isSaved ? "Perbarui API Key" : "Simpan API Key"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeminiAPIForm;
