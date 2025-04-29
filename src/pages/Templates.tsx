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
import EditTemplateDialog from '@/components/modals/EditTemplateDialog';

type Template = Database['public']['Tables']['templates']['Row'];

// Fetch templates from Supabase
const fetchTemplates = async (): Promise<Template[]> => {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching templates:', error);
    throw new Error(error.message);
  }
  console.log('Fetched templates:', data);
  return data;
};

// Create a new template
const createTemplate = async (newTemplate: Omit<Template, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('templates')
    .insert([newTemplate])
    .select()
    .single();
  if (error) {
    console.error('Error creating template:', error);
    throw new Error(error.message);
  }
  return data;
};

// Delete a template
const deleteTemplate = async (id: string) => {
  const { error } = await supabase
    .from('templates')
    .delete()
    .eq('id', id);
  if (error) {
    console.error('Error deleting template:', error);
    throw new Error(error.message);
  }
};

const Templates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
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

  // Mutation for deleting a template
  const deleteMutation = useMutation({
    mutationFn: deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast({
        title: "Template Deleted",
        description: "Template has been deleted successfully",
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
      .filter(tag => tag) as string[];

    createMutation.mutate({
      title: newTemplate.title,
      content: newTemplate.content,
      tags: tagsArray,
    });
  };

  const handleDeleteTemplate = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-4 rounded-lg backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Message Templates</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Template</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Create a reusable message template for common responses.
                  Use {"{name}"} to insert the customer name.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title" className="text-white">Template Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Welcome Message"
                    value={newTemplate.title}
                    onChange={(e) => setNewTemplate({...newTemplate, title: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content" className="text-white">Template Content</Label>
                  <Textarea
                    id="content"
                    placeholder="e.g. Hello {name}, thank you for contacting us!"
                    rows={5}
                    value={newTemplate.content}
                    onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags" className="text-white">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    placeholder="e.g. greeting, welcome"
                    value={newTemplate.tags}
                    onChange={(e) => setNewTemplate({...newTemplate, tags: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-gray-700 text-gray-300 hover:bg-gray-700">Cancel</Button>
                <Button onClick={handleCreateTemplate} disabled={createMutation.isPending} className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
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
              className="pl-8 bg-gray-800/50 border-gray-700 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-700">
            <Tag className="h-4 w-4 mr-2" />
            Filter by Tags
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, index) => (
              <Card key={`skeleton-${index}`} className="overflow-hidden border-gray-600 bg-gray-900/80 backdrop-blur-sm">
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
            <p className="text-red-500">Error loading templates: {(error as Error).message}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden border border-gray-600 bg-gray-900/80 backdrop-blur-sm transform hover:scale-102 transition-all duration-300 hover:shadow-lg hover:shadow-blue-400/20">
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-blue-900/50 to-purple-900/50">
                  <CardTitle className="text-base text-gray-100">{template.title}</CardTitle>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-gray-800"
                      onClick={() => handleCopyTemplate(template.content)}
                    >
                      <Copy className="h-4 w-4 text-blue-300" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-gray-800"
                      onClick={() => handleEditTemplate(template)}
                    >
                      <Edit className="h-4 w-4 text-blue-300" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-gray-800"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="mb-3 text-sm line-clamp-3 text-gray-300">{template.content}</div>
                  {template.tags && template.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {template.tags.map((tag, index) => (
                        <Badge key={`${tag}-${index}`} variant="outline" className="text-xs border-gray-600 text-blue-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="text-xs text-gray-400">
                    Created {formatDate(template.created_at!)}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredTemplates.length == 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                <FileText className="h-12 w-12 text-gray-600" />
                <h3 className="mt-2 text-lg font-medium text-gray-300">No templates found</h3>
                <p className="text-sm text-gray-500">Create templates or try a different search query</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {editingTemplate && (
        <EditTemplateDialog
          isOpen={!!editingTemplate}
          onClose={() => setEditingTemplate(null)}
          template={editingTemplate}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['templates'] });
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default Templates;