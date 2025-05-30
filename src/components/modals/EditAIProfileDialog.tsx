
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
import { Database } from '@/integrations/supabase/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type AIProfile = Database['public']['Tables']['ai_profiles']['Row'];

interface EditAIProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  profile: AIProfile;
  onSuccess: () => void;
}

export default function EditAIProfileDialog({
  isOpen,
  onClose,
  profile,
  onSuccess,
}: EditAIProfileDialogProps) {
  const [updatedProfile, setUpdatedProfile] = useState({
    name: profile.name,
    description: profile.description || '',
    prompt_system: profile.prompt_system,
    ai_model: profile.ai_model || 'openai',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!updatedProfile.name || !updatedProfile.prompt_system) {
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
        .update({
          name: updatedProfile.name,
          description: updatedProfile.description,
          prompt_system: updatedProfile.prompt_system,
          ai_model: updatedProfile.ai_model,
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Profil AI Diperbarui",
        description: "Profil AI telah berhasil diperbarui",
      });
      
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Kesalahan",
        description: error.message || "Gagal memperbarui profil AI",
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
          <DialogTitle>Edit Profil AI</DialogTitle>
          <DialogDescription>
            Perbarui profil kepribadian AI dengan karakteristik dan perilaku tertentu.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Nama Profil</Label>
            <Input
              id="edit-name"
              value={updatedProfile.name}
              onChange={(e) => setUpdatedProfile({...updatedProfile, name: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-description">Deskripsi Profil</Label>
            <Input
              id="edit-description"
              value={updatedProfile.description}
              onChange={(e) => setUpdatedProfile({...updatedProfile, description: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-ai-model">Model AI</Label>
            <Select 
              value={updatedProfile.ai_model} 
              onValueChange={(value) => setUpdatedProfile({...updatedProfile, ai_model: value})}
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
            <Label htmlFor="edit-prompt">Prompt Sistem</Label>
            <Textarea
              id="edit-prompt"
              rows={6}
              value={updatedProfile.prompt_system}
              onChange={(e) => setUpdatedProfile({...updatedProfile, prompt_system: e.target.value})}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Memperbarui..." : "Perbarui Profil"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
