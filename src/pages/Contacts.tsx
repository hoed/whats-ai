import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
import { Search, Plus, Loader2, MessageCircle, MessageSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Contact = Database['public']['Tables']['contacts']['Row'] & {
  message_count?: number;
  latest_session_status?: Database['public']['Enums']['session_status'];
  latest_session_id?: string;
};

// Fetch contacts with related data from Supabase
const fetchContacts = async (): Promise<Contact[]> => {
  const { data, error } = await supabase
    .from('contacts')
    .select(`
      *,
      chat_sessions:chat_sessions!contact_id(
        id,
        status
      ),
      messages:messages!contact_id(count)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching contacts:', error);
    throw new Error(error.message);
  }

  console.log('Fetched contacts:', data);

  // Transform the data to include message count, latest session status, and session ID
  return data.map(contact => ({
    ...contact,
    message_count: contact.messages?.length > 0 ? contact.messages[0].count : 0,
    latest_session_status: contact.chat_sessions?.length > 0 ? contact.chat_sessions[0].status : null,
    latest_session_id: contact.chat_sessions?.length > 0 ? contact.chat_sessions[0].id : null,
  }));
};

// Create a new contact
const createContact = async (newContact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('contacts')
    .insert([newContact])
    .select()
    .single();
  if (error) {
    console.error('Error creating contact:', error);
    throw new Error(error.message);
  }
  return data;
};

const Contacts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch contacts
  const { data: contacts = [], isLoading, error } = useQuery({
    queryKey: ['contacts'],
    queryFn: fetchContacts,
  });

  // Mutation for creating a contact
  const createMutation = useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast({
        title: "Contact Created",
        description: "New contact has been created successfully",
      });
      setIsAddDialogOpen(false);
      setNewContact({ name: '', phone_number: '', tags: [] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // State for new contact form
  const [newContact, setNewContact] = useState<{
    name: string;
    phone_number: string;
    tags: string[];
  }>({
    name: '',
    phone_number: '',
    tags: [],
  });

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(searchLower) ||
      contact.phone_number.toLowerCase().includes(searchLower) ||
      (contact.tags && contact.tags.some(tag => tag.toLowerCase().includes(searchLower)))
    );
  });

  const handleCreateContact = () => {
    if (!newContact.name || !newContact.phone_number) {
      toast({
        title: "Error",
        description: "Name and phone number are required",
        variant: "destructive",
      });
      return;
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(newContact.phone_number)) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number (e.g., +1234567890)",
        variant: "destructive",
      });
      return;
    }

    createMutation.mutate({
      name: newContact.name,
      phone_number: newContact.phone_number,
      tags: newContact.tags.length > 0 ? newContact.tags : [],
    });
  };

  const handleTagsChange = (value: string) => {
    const tagsArray = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setNewContact({ ...newContact, tags: tagsArray });
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to generate WhatsApp link
  const generateWhatsAppLink = (phoneNumber: string) => {
    // Remove any spaces or special characters except the leading +
    const cleanedNumber = phoneNumber.replace(/[^0-9+]/g, '');
    return `https://wa.me/${cleanedNumber}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-4 rounded-lg backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Contacts</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-gray-100">Add New Contact</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Add a new contact to your list. Ensure the phone number is in international format (e.g., +1234567890).
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-gray-100">Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. John Doe"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone_number" className="text-gray-100">Phone Number</Label>
                  <Input
                    id="phone_number"
                    placeholder="e.g. +1234567890"
                    value={newContact.phone_number}
                    onChange={(e) => setNewContact({ ...newContact, phone_number: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags" className="text-gray-100">Tags (comma-separated, optional)</Label>
                  <Input
                    id="tags"
                    placeholder="e.g. customer, vip"
                    value={newContact.tags.join(', ')}
                    onChange={(e) => handleTagsChange(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-gray-700 text-gray-300 hover:bg-gray-700">Cancel</Button>
                <Button onClick={handleCreateContact} disabled={createMutation.isPending} className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                  {createMutation.isPending ? "Creating..." : "Create Contact"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search contacts..."
              className="pl-8 bg-gray-800/50 border-gray-700 text-gray-100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, index) => (
              <Card key={`skeleton-${index}`} className="overflow-hidden border-gray-600 bg-gray-900/80 backdrop-blur-sm">
                <CardHeader className="p-4 pb-2">
                  <div className="h-6 bg-gray-700 rounded w-2/3 animate-pulse"></div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
            <p className="text-red-500">Error loading contacts: {(error as Error).message}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContacts.map((contact) => (
              <Card key={contact.id} className="overflow-hidden border border-gray-600 bg-gray-900/80 backdrop-blur-sm transform hover:scale-102 transition-all duration-300 hover:shadow-lg hover:shadow-blue-400/20">
                <CardHeader className="p-4 pb-2 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
                  <CardTitle className="text-base text-gray-100">{contact.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="mb-2 text-sm text-gray-300">{contact.phone_number}</div>
                  <div className="mb-2 text-sm text-gray-300">
                    Messages: {contact.message_count || 0}
                  </div>
                  {contact.latest_session_status && (
                    <div className="mb-2">
                      <Badge variant="outline" className="text-xs border-gray-600 text-blue-300 bg-blue-500/30">
                        Session: {contact.latest_session_status}
                      </Badge>
                    </div>
                  )}
                  {contact.tags && contact.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {contact.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-gray-600 text-blue-300 bg-blue-500/30">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mb-2">
                    Created {formatDate(contact.created_at!)}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-gray-600 text-blue-300 hover:bg-gray-800"
                    >
                      <a
                        href={generateWhatsAppLink(contact.phone_number)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <MessageCircle className="h-4 w-4 mr-2 text-blue-300" />
                        Chat on WhatsApp
                      </a>
                    </Button>
                    {contact.latest_session_id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/chat/${contact.latest_session_id}`)}
                        className="border-gray-600 text-blue-300 hover:bg-gray-800"
                      >
                        <MessageSquare className="h-4 w-4 mr-2 text-blue-300" />
                        View Chat
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredContacts.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                <h3 className="mt-2 text-lg font-medium text-gray-300">No contacts found</h3>
                <p className="text-sm text-gray-500">Add a new contact or try a different search query</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Contacts;