
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

type TrainingData = Database['public']['Tables']['training_data']['Row'];

interface EditTrainingDataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  trainingData: TrainingData;
  onSuccess: () => void;
}

export default function EditTrainingDataDialog({
  isOpen,
  onClose,
  trainingData,
  onSuccess,
}: EditTrainingDataDialogProps) {
  const [updatedTrainingData, setUpdatedTrainingData] = useState({
    title: trainingData.title,
    content: trainingData.content,
    category: trainingData.category || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!updatedTrainingData.title || !updatedTrainingData.content) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('training_data')
        .update({
          title: updatedTrainingData.title,
          content: updatedTrainingData.content,
          category: updatedTrainingData.category,
        })
        .eq('id', trainingData.id);

      if (error) throw error;

      toast({
        title: "Training Data Updated",
        description: "Training data has been updated successfully",
      });
      
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update training data",
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
          <DialogTitle>Edit Training Data</DialogTitle>
          <DialogDescription>
            Update company knowledge to train the AI.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={updatedTrainingData.title}
              onChange={(e) => setUpdatedTrainingData({...updatedTrainingData, title: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-content">Content</Label>
            <Textarea
              id="edit-content"
              rows={5}
              value={updatedTrainingData.content}
              onChange={(e) => setUpdatedTrainingData({...updatedTrainingData, content: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-category">Category (optional)</Label>
            <Input
              id="edit-category"
              value={updatedTrainingData.category || ''}
              onChange={(e) => setUpdatedTrainingData({...updatedTrainingData, category: e.target.value})}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Training Data"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
