import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Tag, Edit, Trash, BookOpen } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types'; // Import the updated types

// Use the generated type for training_data
type TrainingData = Database['public']['Tables']['training_data']['Row'];

// Fetch training data from Supabase
const fetchTrainingData = async (): Promise<TrainingData[]> => {
  const { data, error } = await supabase
    .from('training_data')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw new Error(error.message);
  return data;
};

// Create new training data
const createTrainingData = async (newData: Omit<TrainingData, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('training_data')
    .insert([newData])
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  return data;
};

// Delete training data
const deleteTrainingData = async (id: string) => {
  const { error } = await supabase
    .from('training_data')
    .delete()
    .eq('id', id);
  
  if (error) throw new Error(error.message);
};

const Training = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch training data
  const { 
    data: trainingData = [], 
    isLoading,
    error,
  } = useQuery({
    queryKey: ['trainingData'],
    queryFn: fetchTrainingData,
  });

  // Mutation for creating training data
  const createMutation = useMutation({
    mutationFn: createTrainingData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainingData'] });
      toast({
        title: "Training Data Created",
        description: "New training data has been created successfully",
      });
      setIsDialogOpen(false);
      setNewTrainingData({ title: '', content: '', category: '' });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation for deleting training data
  const deleteMutation = useMutation({
    mutationFn: deleteTrainingData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainingData'] });
      toast({
        title: "Training Data Deleted",
        description: "Training data has been deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter training data based on search query
  const filteredTrainingData = trainingData.filter(data => {
    const searchLower = searchQuery.toLowerCase();
    return (
      data.title.toLowerCase().includes(searchLower) ||
      data.content.toLowerCase().includes(searchLower) ||
      (data.category?.toLowerCase().includes(searchLower) || false)
    );
  });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // New training data form state
  const [newTrainingData, setNewTrainingData] = useState<{
    title: string;
    content: string;
    category: string;
  }>({
    title: '',
    content: '',
    category: '',
  });

  const handleCreateTrainingData = () => {
    if (!newTrainingData.title || !newTrainingData.content) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    createMutation.mutate(newTrainingData);
  };

  const handleDeleteTrainingData = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Training Data</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Training Data
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New Training Data</DialogTitle>
                <DialogDescription>
                  Add company knowledge to train the AI. This can include FAQs, policies, or other relevant information.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Company FAQ"
                    value={newTrainingData.title}
                    onChange={(e) => setNewTrainingData({...newTrainingData, title: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="e.g. Frequently Asked Questions: 1. What are your business hours? We are open from 9 AM to 5 PM, Monday to Friday."
                    rows={5}
                    value={newTrainingData.content}
                    onChange={(e) => setNewTrainingData({...newTrainingData, content: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category (optional)</Label>
                  <Input
                    id="category"
                    placeholder="e.g. FAQ, Policies"
                    value={newTrainingData.category}
                    onChange={(e) => setNewTrainingData({...newTrainingData, category: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateTrainingData} disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create Training Data"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search training data..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Tag className="h-4 w-4 mr-2" />
            Filter by Category
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, index) => (
              <Card key={`skeleton-${index}`} className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="h-20 bg-gray-200 rounded mb-3 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
            <p className="text-red-500">Error loading training data: {(error as Error).message}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTrainingData.map((data) => (
              <Card key={data.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-base">{data.title}</CardTitle>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleDeleteTrainingData(data.id)}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="mb-3 text-sm line-clamp-3">{data.content}</div>
                  {data.category && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {data.category}
                      </Badge>
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    Created {formatDate(data.created_at)}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredTrainingData.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                <BookOpen className="h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-lg font-medium">No training data found</h3>
                <p className="text-sm text-gray-500">Add training data or try a different search query</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Training;