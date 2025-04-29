
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

type Template = Database['public']['Tables']['templates']['Row'];

interface EditTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  template: Template;
  onSuccess: () => void;
}

export default function EditTemplateDialog({
  isOpen,
  onClose,
  template,
  onSuccess,
}: EditTemplateDialogProps) {
  const [updatedTemplate, setUpdatedTemplate] = useState({
    title: template.title,
    content: template.content,
    tags: template.tags ? template.tags.join(', ') : '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!updatedTemplate.title || !updatedTemplate.content) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const tagsArray = updatedTemplate.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag) as string[];

      const { error } = await supabase
        .from('templates')
        .update({
          title: updatedTemplate.title,
          content: updatedTemplate.content,
          tags: tagsArray,
        })
        .eq('id', template.id);

      if (error) throw error;

      toast({
        title: "Template Updated",
        description: "Template has been updated successfully",
      });
      
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update template",
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
          <DialogTitle>Edit Template</DialogTitle>
          <DialogDescription>
            Update your message template. Use {"{name}"} to insert the customer name.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-title">Template Title</Label>
            <Input
              id="edit-title"
              value={updatedTemplate.title}
              onChange={(e) => setUpdatedTemplate({...updatedTemplate, title: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-content">Template Content</Label>
            <Textarea
              id="edit-content"
              rows={5}
              value={updatedTemplate.content}
              onChange={(e) => setUpdatedTemplate({...updatedTemplate, content: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-tags">Tags (comma separated)</Label>
            <Input
              id="edit-tags"
              value={updatedTemplate.tags}
              onChange={(e) => setUpdatedTemplate({...updatedTemplate, tags: e.target.value})}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
