
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Search, Plus, Star, Edit, Trash, Copy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import EditAIProfileDialog from '@/components/modals/EditAIProfileDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type AIProfile = Database['public']['Tables']['ai_profiles']['Row'];

// Fetch AI profiles from Supabase
const fetchAIProfiles = async (): Promise<AIProfile[]> => {
  const { data, error } = await supabase
    .from('ai_profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching AI profiles:', error);
    throw new Error(error.message);
  }
  console.log('Fetched AI profiles:', data);
  return data;
};

// Create a new AI profile
const createAIProfile = async (newProfile: Omit<AIProfile, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('ai_profiles')
    .insert([newProfile])
    .select()
    .single();
  if (error) {
    console.error('Error creating AI profile:', error);
    throw new Error(error.message);
  }
  return data;
};

// Delete an AI profile
const deleteAIProfile = async (id: string) => {
  const { error } = await supabase
    .from('ai_profiles')
    .delete()
    .eq('id', id);
  if (error) {
    console.error('Error deleting AI profile:', error);
    throw new Error(error.message);
  }
};

const AIProfiles = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<AIProfile | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // New profile form state
  const [newProfile, setNewProfile] = useState<{
    name: string;
    description: string;
    prompt_system: string;
    ai_model: string;
  }>({
    name: '',
    description: '',
    prompt_system: '',
    ai_model: 'openai',
  });

  // Fetch AI profiles
  const { 
    data: aiProfiles = [], 
    isLoading,
    error
  } = useQuery({
    queryKey: ['aiProfiles'],
    queryFn: fetchAIProfiles,
  });

  // Mutation for creating an AI profile
  const createMutation = useMutation({
    mutationFn: createAIProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiProfiles'] });
      toast({
        title: "AI Profile Created",
        description: "New AI profile has been created successfully",
      });
      setIsDialogOpen(false);
      setNewProfile({ name: '', description: '', prompt_system: '', ai_model: 'openai' });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation for deleting an AI profile
  const deleteMutation = useMutation({
    mutationFn: deleteAIProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiProfiles'] });
      toast({
        title: "AI Profile Deleted",
        description: "AI profile has been deleted successfully",
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

  // Filter profiles based on search query
  const filteredProfiles = aiProfiles.filter(profile => {
    const searchLower = searchQuery.toLowerCase();
    return (
      profile.name.toLowerCase().includes(searchLower) ||
      (profile.description && profile.description.toLowerCase().includes(searchLower)) ||
      profile.prompt_system.toLowerCase().includes(searchLower)
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

  const handleCreateProfile = () => {
    if (!newProfile.name || !newProfile.prompt_system) {
      toast({
        title: "Error",
        description: "Name and system prompt are required",
        variant: "destructive",
      });
      return;
    }

    createMutation.mutate({
      name: newProfile.name,
      description: newProfile.description,
      prompt_system: newProfile.prompt_system,
      ai_model: newProfile.ai_model,
    });
  };

  const handleDeleteProfile = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleCopyProfile = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "System prompt copied to clipboard",
      });
    });
  };

  const handleEditProfile = (profile: AIProfile) => {
    setEditingProfile(profile);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-4 rounded-lg backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">AI Profiles</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="h-4 w-4 mr-2" />
                Create AI Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Create New AI Profile</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Set up a new AI personality profile with specific characteristics and behavior.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-white">Profile Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Friendly Support Agent"
                    value={newProfile.name}
                    onChange={(e) => setNewProfile({...newProfile, name: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description" className="text-white">Profile Description</Label>
                  <Input
                    id="description"
                    placeholder="e.g. A warm and friendly customer support agent"
                    value={newProfile.description}
                    onChange={(e) => setNewProfile({...newProfile, description: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ai-model" className="text-white">AI Model</Label>
                  <Select
                    value={newProfile.ai_model}
                    onValueChange={(value) => setNewProfile({...newProfile, ai_model: value})}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select AI Model" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="openai">OpenAI (GPT-4o)</SelectItem>
                      <SelectItem value="gemini">Google Gemini</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="prompt" className="text-white">System Prompt</Label>
                  <Textarea
                    id="prompt"
                    placeholder="e.g. You are a friendly customer support agent. Be warm and conversational..."
                    rows={6}
                    value={newProfile.prompt_system}
                    onChange={(e) => setNewProfile({...newProfile, prompt_system: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-gray-700 text-gray-300 hover:bg-gray-700">Cancel</Button>
                <Button onClick={handleCreateProfile} disabled={createMutation.isPending} className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                  {createMutation.isPending ? "Creating..." : "Create Profile"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search AI profiles..."
              className="pl-8 bg-gray-800/50 border-gray-700 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array(4).fill(0).map((_, index) => (
              <Card key={`skeleton-${index}`} className="overflow-hidden border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                <CardHeader className="p-4 pb-2">
                  <div className="h-6 bg-gray-700 rounded w-2/3 animate-pulse"></div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="h-4 bg-gray-700 rounded mb-3 animate-pulse"></div>
                  <div className="h-20 bg-gray-700 rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
            <p className="text-red-500">Error loading AI profiles: {(error as Error).message}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProfiles.map((profile) => (
              <Card key={profile.id} className="overflow-hidden border border-gray-700 bg-gray-800/50 backdrop-blur-sm transform hover:scale-102 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-blue-900/40 to-purple-900/40">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-amber-400 mr-2" />
                    <CardTitle className="text-base text-white">{profile.name}</CardTitle>
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-gray-700"
                      onClick={() => handleCopyProfile(profile.prompt_system)}
                    >
                      <Copy className="h-4 w-4 text-blue-400" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-gray-700"
                      onClick={() => handleEditProfile(profile)}
                    >
                      <Edit className="h-4 w-4 text-blue-400" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-gray-700"
                      onClick={() => handleDeleteProfile(profile.id)}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-sm mb-2 font-medium text-gray-400">
                    {profile.description}
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300 mr-2">
                      {profile.ai_model === 'gemini' ? 'Google Gemini' : 'OpenAI GPT'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 border-l-2 border-gray-700 pl-2 py-1 mb-3 line-clamp-3">
                    {profile.prompt_system}
                  </div>
                  <div className="text-xs text-gray-600">
                    Created {formatDate(profile.created_at!)}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredProfiles.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                <Star className="h-12 w-12 text-gray-700" />
                <h3 className="mt-2 text-lg font-medium text-gray-300">No AI profiles found</h3>
                <p className="text-sm text-gray-500">Create AI personality profiles or try a different search query</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {editingProfile && (
        <EditAIProfileDialog
          isOpen={!!editingProfile}
          onClose={() => setEditingProfile(null)}
          profile={editingProfile}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['aiProfiles'] });
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default AIProfiles;
