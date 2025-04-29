
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
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!updatedProfile.name || !updatedProfile.prompt_system) {
      toast({
        title: "Error",
        description: "Name and system prompt are required",
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
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "AI Profile Updated",
        description: "AI profile has been updated successfully",
      });
      
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update AI profile",
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
          <DialogTitle>Edit AI Profile</DialogTitle>
          <DialogDescription>
            Update the AI personality profile with specific characteristics and behavior.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Profile Name</Label>
            <Input
              id="edit-name"
              value={updatedProfile.name}
              onChange={(e) => setUpdatedProfile({...updatedProfile, name: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-description">Profile Description</Label>
            <Input
              id="edit-description"
              value={updatedProfile.description}
              onChange={(e) => setUpdatedProfile({...updatedProfile, description: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-prompt">System Prompt</Label>
            <Textarea
              id="edit-prompt"
              rows={6}
              value={updatedProfile.prompt_system}
              onChange={(e) => setUpdatedProfile({...updatedProfile, prompt_system: e.target.value})}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Profile"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
