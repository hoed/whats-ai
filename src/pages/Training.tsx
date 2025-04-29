
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
import { Database } from '@/integrations/supabase/types';
import EditTrainingDataDialog from '@/components/modals/EditTrainingDataDialog';

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
  const [editingTrainingData, setEditingTrainingData] = useState<TrainingData | null>(null);
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
  
  const handleEditTrainingData = (data: TrainingData) => {
    setEditingTrainingData(data);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-4 rounded-lg backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">AI Training Data</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="h-4 w-4 mr-2" />
                Add Training Data
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Training Data</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Add company knowledge to train the AI. This can include FAQs, policies, or other relevant information.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title" className="text-white">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Company FAQ"
                    value={newTrainingData.title}
                    onChange={(e) => setNewTrainingData({...newTrainingData, title: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content" className="text-white">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="e.g. Frequently Asked Questions: 1. What are your business hours? We are open from 9 AM to 5 PM, Monday to Friday."
                    rows={5}
                    value={newTrainingData.content}
                    onChange={(e) => setNewTrainingData({...newTrainingData, content: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category" className="text-white">Category (optional)</Label>
                  <Input
                    id="category"
                    placeholder="e.g. FAQ, Policies"
                    value={newTrainingData.category}
                    onChange={(e) => setNewTrainingData({...newTrainingData, category: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-gray-700 text-gray-300 hover:bg-gray-700">Cancel</Button>
                <Button onClick={handleCreateTrainingData} disabled={createMutation.isPending} className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
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
              className="pl-8 bg-gray-800/50 border-gray-700 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-700">
            <Tag className="h-4 w-4 mr-2" />
            Filter by Category
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, index) => (
              <Card key={`skeleton-${index}`} className="overflow-hidden border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                <CardHeader className="p-4 pb-2">
                  <div className="h-6 bg-gray-700 rounded w-2/3 animate-pulse"></div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="h-20 bg-gray-700 rounded mb-3 animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>
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
              <Card key={data.id} className="overflow-hidden border border-gray-700 bg-gray-800/50 backdrop-blur-sm transform hover:scale-102 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-blue-900/40 to-purple-900/40">
                  <CardTitle className="text-base text-white">{data.title}</CardTitle>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-gray-700"
                      onClick={() => handleEditTrainingData(data)}
                    >
                      <Edit className="h-4 w-4 text-blue-400" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-gray-700"
                      onClick={() => handleDeleteTrainingData(data.id)}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="mb-3 text-sm line-clamp-3 text-gray-300">{data.content}</div>
                  {data.category && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      <Badge variant="outline" className="text-xs border-gray-600 text-blue-400">
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
                <BookOpen className="h-12 w-12 text-gray-700" />
                <h3 className="mt-2 text-lg font-medium text-gray-300">No training data found</h3>
                <p className="text-sm text-gray-500">Add training data or try a different search query</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {editingTrainingData && (
        <EditTrainingDataDialog
          isOpen={!!editingTrainingData}
          onClose={() => setEditingTrainingData(null)}
          trainingData={editingTrainingData}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['trainingData'] });
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default Training;
