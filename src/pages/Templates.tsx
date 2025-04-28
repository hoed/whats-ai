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
import { Search, Plus, Tag, Edit, Trash, Copy, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Template = Database['public']['Tables']['templates']['Row'];

// Fetch templates from Supabase
const fetchTemplates = async (): Promise<Template[]> => {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

// Create a new template
const createTemplate = async (newTemplate: Omit<Template, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('templates')
    .insert([newTemplate])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

const Templates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch templates
  const { 
    data: templates = [], 
    isLoading,
    error
  } = useQuery({
    queryKey: ['templates'],
    queryFn: fetchTemplates,
  });

  // Mutation for creating a template
  const createMutation = useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast({
        title: "Template Created",
        description: "New template has been created successfully",
      });
      setIsDialogOpen(false);
      setNewTemplate({ title: '', content: '', tags: '' });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter templates based on search query
  const filteredTemplates = templates.filter(template => {
    const searchLower = searchQuery.toLowerCase();
    return (
      template.title.toLowerCase().includes(searchLower) ||
      template.content.toLowerCase().includes(searchLower) ||
      (template.tags && template.tags.some(tag => tag.toLowerCase().includes(searchLower)))
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

  const handleCopyTemplate = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Template content copied to clipboard",
      });
    });
  };

  // New template form state
  const [newTemplate, setNewTemplate] = useState<{
    title: string;
    content: string;
    tags: string; // This is a string for the input field
  }>({
    title: '',
    content: '',
    tags: '',
  });

  const handleCreateTemplate = () => {
    if (!newTemplate.title || !newTemplate.content) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    const tagsArray = newTemplate.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag) as string[]; // Explicitly cast to string[] to avoid undefined

    createMutation.mutate({
      title: newTemplate.title,
      content: newTemplate.content,
      tags: tagsArray,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Message Templates</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
                <DialogDescription>
                  Create a reusable message template for common responses.
                  Use {"{name}"} to insert the customer name.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Template Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Welcome Message"
                    value={newTemplate.title}
                    onChange={(e) => setNewTemplate({...newTemplate, title: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Template Content</Label>
                  <Textarea
                    id="content"
                    placeholder="e.g. Hello {name}, thank you for contacting us!"
                    rows={5}
                    value={newTemplate.content}
                    onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    placeholder="e.g. greeting, welcome"
                    value={newTemplate.tags}
                    onChange={(e) => setNewTemplate({...newTemplate, tags: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateTemplate} disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create Template"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search templates..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Tag className="h-4 w-4 mr-2" />
            Filter by Tags
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
            <p className="text-red-500">Error loading templates: {(error as Error).message}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-base">{template.title}</CardTitle>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleCopyTemplate(template.content)}
                    >
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
                  <div className="mb-3 text-sm line-clamp-3">{template.content}</div>
                  {template.tags && template.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {template.tags.map((tag, index) => (
                        <Badge key={`${tag}-${index}`} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    Created {formatDate(template.created_at!)}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredTemplates.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                <FileText className="h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-lg font-medium">No templates found</h3>
                <p className="text-sm text-gray-500">Create templates or try a different search query</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Templates;