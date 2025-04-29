
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CreateAIProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateAIProfileDialog({
  isOpen,
  onClose,
  onSuccess,
}: CreateAIProfileDialogProps) {
  const [profile, setProfile] = useState({
    name: '',
    description: '',
    prompt_system: '',
    ai_model: 'openai', // Default to OpenAI
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!profile.name || !profile.prompt_system) {
      toast({
        title: "Kesalahan",
        description: "Nama dan prompt sistem diperlukan",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('ai_profiles')
        .insert({
          name: profile.name,
          description: profile.description || null,
          prompt_system: profile.prompt_system,
          ai_model: profile.ai_model,
        });

      if (error) throw error;

      toast({
        title: "Profil AI Dibuat",
        description: "Profil AI baru telah berhasil dibuat",
      });
      
      setProfile({
        name: '',
        description: '',
        prompt_system: '',
        ai_model: 'openai',
      });
      
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Kesalahan",
        description: error.message || "Gagal membuat profil AI",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Buat Profil AI</DialogTitle>
          <DialogDescription>
            Buat profil kepribadian AI baru dengan karakteristik dan perilaku tertentu.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nama Profil</Label>
            <Input
              id="name"
              placeholder="Asisten Penjualan"
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Deskripsi Profil</Label>
            <Input
              id="description"
              placeholder="Asisten untuk membantu pelanggan dengan pertanyaan produk"
              value={profile.description}
              onChange={(e) => setProfile({...profile, description: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ai_model">Model AI</Label>
            <Select 
              value={profile.ai_model} 
              onValueChange={(value) => setProfile({...profile, ai_model: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Model AI" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI (GPT-4o)</SelectItem>
                <SelectItem value="gemini">Google Gemini</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="prompt">Prompt Sistem</Label>
            <Textarea
              id="prompt"
              rows={6}
              placeholder="Anda adalah asisten penjualan yang sopan dan berpengetahuan luas..."
              value={profile.prompt_system}
              onChange={(e) => setProfile({...profile, prompt_system: e.target.value})}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Membuat..." : "Buat Profil"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
