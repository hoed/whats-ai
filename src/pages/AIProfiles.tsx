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

const AIProfiles = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      setNewProfile({ name: '', description: '', prompt_system: '' });
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
      profile.description.toLowerCase().includes(searchLower) ||
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

  // New profile form state
  const [newProfile, setNewProfile] = useState<{
    name: string;
    description: string;
    prompt_system: string;
  }>({
    name: '',
    description: '',
    prompt_system: '',
  });

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
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Profiles</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create AI Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create New AI Profile</DialogTitle>
                <DialogDescription>
                  Set up a new AI personality profile with specific characteristics and behavior.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Profile Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Friendly Support Agent"
                    value={newProfile.name}
                    onChange={(e) => setNewProfile({...newProfile, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Profile Description</Label>
                  <Input
                    id="description"
                    placeholder="e.g. A warm and friendly customer support agent"
                    value={newProfile.description}
                    onChange={(e) => setNewProfile({...newProfile, description: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="prompt">System Prompt</Label>
                  <Textarea
                    id="prompt"
                    placeholder="e.g. You are a friendly customer support agent. Be warm and conversational..."
                    rows={6}
                    value={newProfile.prompt_system}
                    onChange={(e) => setNewProfile({...newProfile, prompt_system: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateProfile} disabled={createMutation.isPending}>
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
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array(4).fill(0).map((_, index) => (
              <Card key={`skeleton-${index}`} className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="h-4 bg-gray-200 rounded mb-3 animate-pulse"></div>
                  <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
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
              <Card key={profile.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-amber-400 mr-2" />
                    <CardTitle className="text-base">{profile.name}</CardTitle>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-sm mb-2 font-medium text-gray-600">
                    {profile.description}
                  </div>
                  <div className="text-xs text-gray-500 border-l-2 border-gray-200 pl-2 py-1 mb-3 line-clamp-3">
                    {profile.prompt_system}
                  </div>
                  <div className="text-xs text-gray-500">
                    Created {formatDate(profile.created_at!)}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredProfiles.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                <Star className="h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-lg font-medium">No AI profiles found</h3>
                <p className="text-sm text-gray-500">Create AI personality profiles or try a different search query</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AIProfiles;