import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Message = Database['public']['Tables']['messages']['Row'];
type ChatSession = Database['public']['Tables']['chat_sessions']['Row'] & {
  contact: Database['public']['Tables']['contacts']['Row'];
};
type AIProfile = Database['public']['Tables']['ai_profiles']['Row'];
type Template = Database['public']['Tables']['templates']['Row'];
type TrainingData = Database['public']['Tables']['training_data']['Row'];

const ChatDetail = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState('');
  const [selectedAIProfile, setSelectedAIProfile] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedTrainingData, setSelectedTrainingData] = useState<string | null>(null);

  // Fetch chat session
  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ['chatSession', sessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*, contact:contacts(*)')
        .eq('id', sessionId!)
        .single();
      if (error) throw new Error(error.message);
      return data as ChatSession;
    },
    enabled: !!sessionId,
  });

  // Fetch messages
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', sessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          ai_profile:ai_profiles(name),
          template:templates(title),
          training_data:training_data(title)
        `)
        .eq('contact_id', session?.contact_id!)
        .order('timestamp', { ascending: true });
      if (error) throw new Error(error.message);
      return data as (Message & {
        ai_profile: { name: string } | null;
        template: { title: string } | null;
        training_data: { title: string } | null;
      })[];
    },
    enabled: !!session?.contact_id,
  });

  // Fetch AI profiles
  const { data: aiProfiles = [] } = useQuery({
    queryKey: ['aiProfiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_profiles')
        .select('*');
      if (error) throw new Error(error.message);
      return data as AIProfile[];
    },
  });

  // Fetch templates
  const { data: templates = [] } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('templates')
        .select('*');
      if (error) throw new Error(error.message);
      return data as Template[];
    },
  });

  // Fetch training data
  const { data: trainingData = [] } = useQuery({
    queryKey: ['trainingData'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_data')
        .select('*');
      if (error) throw new Error(error.message);
      return data as TrainingData[];
    },
  });

  // Mutation for sending a message
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const newMessage: Omit<Message, 'id' | 'timestamp'> = {
        contact_id: session!.contact_id,
        role: 'ai',
        content,
        ai_profile_id: selectedAIProfile || null,
        template_id: selectedTemplate || null,
        training_data_id: selectedTrainingData || null, // Added
      };
      const { data, error } = await supabase
        .from('messages')
        .insert([newMessage])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', sessionId] });
      setNewMessage('');
      setSelectedTemplate(null);
      setSelectedTrainingData(null);
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
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

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    sendMessageMutation.mutate(newMessage);
  };

  const handleApplyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setNewMessage(template.content);
      setSelectedTemplate(templateId);
    }
  };

  const handleApplyTrainingData = (trainingDataId: string) => {
    const training = trainingData.find(t => t.id === trainingDataId);
    if (training) {
      setNewMessage(training.content);
      setSelectedTrainingData(trainingDataId);
    }
  };

  if (sessionLoading || messagesLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!session) {
    return (
      <DashboardLayout>
        <div className="text-center p-8">
          <h2 className="text-lg font-medium">Chat session not found</h2>
          <Button variant="outline" onClick={() => navigate('/')} className="mt-4">
            Back to Chats
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">{session.contact.name}</h1>
              <p className="text-sm text-gray-500">{session.contact.phone_number}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{session.status}</Badge>
            <Select
              value={session.status}
              onValueChange={async (value: 'open' | 'pending' | 'closed') => {
                const { error } = await supabase
                  .from('chat_sessions')
                  .update({ status: value })
                  .eq('id', sessionId!);
                if (error) {
                  toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                  });
                } else {
                  queryClient.invalidateQueries({ queryKey: ['chatSession', sessionId] });
                }
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'ai' ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[70%] ${
                      message.role === 'ai' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <Avatar>
                      <AvatarImage src={message.role === 'ai' ? '/ai-avatar.png' : '/user-avatar.png'} />
                      <AvatarFallback>{message.role === 'ai' ? 'AI' : 'U'}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-lg p-3 ${
                        message.role === 'ai' ? 'bg-primary text-primary-foreground' : 'bg-gray-200'
                      }`}
                    >
                      <p>{message.content}</p>
                      {message.role === 'ai' && (
                        <div className="text-xs mt-1 opacity-70">
                          {message.ai_profile && <span>Sent by {message.ai_profile.name} | </span>}
                          {message.template && <span>Using template: {message.template.title} | </span>}
                          {message.training_data && <span>Based on training: {message.training_data.title} | </span>}
                          <span>{new Date(message.timestamp!).toLocaleTimeString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
            <div className="flex flex-col space-y-2 mt-4">
              <div className="flex space-x-2">
                <Select
                  value={selectedAIProfile || ''}
                  onValueChange={(value) => setSelectedAIProfile(value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select AI Profile" />
                  </SelectTrigger>
                  <SelectContent>
                    {aiProfiles.map((profile) => (
                      <SelectItem key={profile.id} value={profile.id}>
                        {profile.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedTemplate || ''}
                  onValueChange={(value) => handleApplyTemplate(value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedTrainingData || ''}
                  onValueChange={(value) => handleApplyTrainingData(value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Training Data" />
                  </SelectTrigger>
                  <SelectContent>
                    {trainingData.map((training) => (
                      <SelectItem key={training.id} value={training.id}>
                        {training.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={sendMessageMutation.isPending || !newMessage.trim()}
                >
                  {sendMessageMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ChatDetail;