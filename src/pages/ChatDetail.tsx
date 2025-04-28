
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ChatInterface from '@/components/chat/ChatInterface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, Clock, CheckCircle, X, UserCheck, Tag } from 'lucide-react';
import { 
  fetchMessages, 
  fetchChatSessions,
  fetchAIProfiles,
  fetchTemplates,
  fetchContacts,
  sendMessage,
  updateChatSessionStatus
} from '@/services/mockData';
import { useToast } from '@/components/ui/use-toast';

const ChatDetail = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { toast } = useToast();

  // Queries
  const { 
    data: messages = [], 
    isLoading: isLoadingMessages,
    refetch: refetchMessages
  } = useQuery({
    queryKey: ['messages', sessionId],
    queryFn: () => sessionId ? fetchMessages(sessionId) : Promise.resolve([]),
    enabled: !!sessionId
  });
  
  const { 
    data: sessions = [],
    isLoading: isLoadingSessions
  } = useQuery({
    queryKey: ['chatSessions'],
    queryFn: fetchChatSessions
  });
  
  const {
    data: contacts = [],
    isLoading: isLoadingContacts
  } = useQuery({
    queryKey: ['contacts'],
    queryFn: fetchContacts
  });
  
  const {
    data: aiProfiles = [],
    isLoading: isLoadingAIProfiles
  } = useQuery({
    queryKey: ['aiProfiles'],
    queryFn: fetchAIProfiles
  });
  
  const {
    data: templates = [],
    isLoading: isLoadingTemplates
  } = useQuery({
    queryKey: ['templates'],
    queryFn: fetchTemplates
  });

  // Find the current session
  const currentSession = sessions.find(session => session.id === sessionId);
  
  // Find the contact for this session
  const contact = contacts.find(contact => 
    contact.id === currentSession?.contact_id
  );
  
  const handleSendMessage = async (message: string) => {
    if (!sessionId) return;
    
    try {
      await sendMessage(sessionId, message);
      // Re-fetch messages after sending
      setTimeout(() => {
        refetchMessages();
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };
  
  const handleChangeStatus = async (status: 'open' | 'pending' | 'closed') => {
    if (!sessionId) return;
    
    try {
      await updateChatSessionStatus(sessionId, status);
      toast({
        title: "Status updated",
        description: `Conversation status changed to ${status}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update conversation status",
        variant: "destructive",
      });
    }
  };
  
  const handleChangeAIProfile = (profileId: string) => {
    console.log('Changed AI Profile to:', profileId);
    // In a real implementation, this would update the AI profile in the database
  };

  // Loading states
  const isLoading = isLoadingMessages || isLoadingSessions || isLoadingContacts || 
                    isLoadingAIProfiles || isLoadingTemplates;
  
  // Get status badge
  const getStatusBadge = (status?: 'open' | 'pending' | 'closed') => {
    switch (status) {
      case 'open':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>;
      case 'closed':
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-8rem)] gap-4">
        {/* Chat Interface */}
        <div className="flex-grow">
          <ChatInterface
            contact={contact}
            messages={messages}
            aiProfiles={aiProfiles}
            templates={templates}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onChangeAIProfile={handleChangeAIProfile}
          />
        </div>
        
        {/* Contact Details Sidebar */}
        <div className="w-72">
          <Card className="h-full">
            <CardHeader className="px-4 py-3">
              <CardTitle className="text-base">Conversation Info</CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-2">
              {isLoading ? (
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">Status</h3>
                    <div className="flex space-x-2">
                      {getStatusBadge(currentSession?.status)}
                      
                      <div className="flex-grow"></div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-6 text-xs px-2"
                        onClick={() => handleChangeStatus('open')}
                      >
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Active
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-6 text-xs px-2"
                        onClick={() => handleChangeStatus('closed')}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Close
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">Customer</h3>
                    <div className="text-sm">{contact?.name || 'Unknown'}</div>
                    <div className="text-xs text-gray-500">{contact?.phone_number}</div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {contact?.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                      <Button variant="ghost" size="icon" className="h-5 w-5">
                        <Tag className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">AI Assignment</h3>
                    <div className="flex items-center">
                      <span className="text-sm">Auto-assigned to AI</span>
                      <div className="ml-1 h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2 text-xs"
                    >
                      <UserCheck className="h-3 w-3 mr-1" />
                      Assign to Human Agent
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">Activity</h3>
                    <div className="text-xs">
                      <div className="flex justify-between items-center py-1">
                        <span>First contact</span>
                        <span className="text-gray-500">2 days ago</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span>Messages exchanged</span>
                        <span className="font-medium">{messages.length}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span>Last activity</span>
                        <span className="text-gray-500">Just now</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChatDetail;
