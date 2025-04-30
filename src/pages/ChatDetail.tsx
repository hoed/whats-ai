
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

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

  // Validate sessionId
  const isValidUUID = sessionId && UUID_REGEX.test(sessionId);

  // Fetch chat session
  const { data: session, isLoading: sessionLoading, error: sessionError } = useQuery({
    queryKey: ['chatSession', sessionId],
    queryFn: async () => {
      if (!isValidUUID) {
        throw new Error('Invalid session ID format');
      }
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*, contact:contacts(*)')
        .eq('id', sessionId!)
        .single();
      if (error) {
        console.error('Error fetching chat session:', error);
        throw new Error(error.message);
      }
      console.log('Fetched chat session:', data);
      return data as ChatSession;
    },
    enabled: !!sessionId && isValidUUID,
  });

  // Fetch messages
  const { data: messages = [], isLoading: messagesLoading, error: messagesError } = useQuery({
    queryKey: ['messages', sessionId],
    queryFn: async () => {
      if (!session?.contact_id) {
        throw new Error('Contact ID not available');
      }
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          ai_profile:ai_profiles(name),
          template:templates(title),
          training_data:training_data(title)
        `)
        .eq('contact_id', session.contact_id)
        .order('timestamp', { ascending: true });
      if (error) {
        console.error('Error fetching messages:', error);
        throw new Error(error.message);
      }
      console.log('Fetched messages:', data);
      return data as (Message & {
        ai_profile: { name: string } | null;
        template: { title: string } | null;
        training_data: { title: string } | null;
      })[];
    },
    enabled: !!session?.contact_id && isValidUUID,
  });

  // Fetch AI profiles
  const { data: aiProfiles = [], error: aiProfilesError } = useQuery({
    queryKey: ['aiProfiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_profiles')
        .select('*');
      if (error) {
        console.error('Error fetching AI profiles:', error);
        throw new Error(error.message);
      }
      console.log('Fetched AI profiles for dropdown:', data);
      return data as AIProfile[];
    },
  });

  // Fetch templates
  const { data: templates = [], error: templatesError } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('templates')
        .select('*');
      if (error) {
        console.error('Error fetching templates:', error);
        throw new Error(error.message);
      }
      console.log('Fetched templates for dropdown:', data);
      return data as Template[];
    },
  });

  // Fetch training data
  const { data: trainingData = [], error: trainingDataError } = useQuery({
    queryKey: ['trainingData'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_data')
        .select('*');
      if (error) {
        console.error('Error fetching training data:', error);
        throw new Error(error.message);
      }
      console.log('Fetched training data for dropdown:', data);
      return data as TrainingData[];
    },
  });

  // Mutation for sending a message
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!session?.contact_id) {
        throw new Error('Contact ID not available');
      }
      
      // First get the current user_id (for demo purposes, we'll use a fixed value)
      // In a real app, you'd get this from authentication context
      const user_id = "00000000-0000-0000-0000-000000000000"; 
      
      const newMessageData = {
        contact_id: session.contact_id,
        role: 'ai',
        content,
        ai_profile_id: selectedAIProfile || null,
        template_id: selectedTemplate || null,
        training_data_id: selectedTrainingData || null,
        user_id: user_id
      };
      
      const { data, error } = await supabase
        .from('messages')
        .insert([newMessageData])
        .select()
        .single();
      
      if (error) {
        console.error('Error sending message:', error);
        throw new Error(error.message);
      }
      
      // Update the last activity timestamp on the chat session
      await supabase
        .from('chat_sessions')
        .update({ last_activity: new Date().toISOString() })
        .eq('id', sessionId!);
        
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', sessionId] });
      setNewMessage('');
      setSelectedTemplate(null);
      setSelectedTrainingData(null);
      toast({
        title: "Pesan Terkirim",
        description: "Pesan Anda telah berhasil dikirim.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Kesalahan",
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

  if (!isValidUUID) {
    return (
      <DashboardLayout>
        <div className="text-center p-8">
          <h2 className="text-lg font-medium">ID Sesi Chat Tidak Valid</h2>
          <p className="text-red-500">ID sesi yang diberikan tidak valid.</p>
          <Button variant="outline" onClick={() => navigate('/')} className="mt-4">
            Kembali ke Chat
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  if (sessionLoading || messagesLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (sessionError || messagesError || aiProfilesError || templatesError || trainingDataError) {
    return (
      <DashboardLayout>
        <div className="text-center p-8">
          <h2 className="text-lg font-medium">Kesalahan memuat data chat</h2>
          <p className="text-red-500">
            {sessionError?.message || messagesError?.message || aiProfilesError?.message || templatesError?.message || trainingDataError?.message}
          </p>
          <Button variant="outline" onClick={() => navigate('/')} className="mt-4">
            Kembali ke Chat
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  if (!session) {
    return (
      <DashboardLayout>
        <div className="text-center p-8">
          <h2 className="text-lg font-medium">Sesi chat tidak ditemukan</h2>
          <Button variant="outline" onClick={() => navigate('/')} className="mt-4">
            Kembali ke Chat
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
                    title: "Kesalahan",
                    description: error.message,
                    variant: "destructive",
                  });
                } else {
                  queryClient.invalidateQueries({ queryKey: ['chatSession', sessionId] });
                  toast({
                    title: "Status Diperbarui",
                    description: `Status percakapan diubah menjadi ${value}.`,
                  });
                }
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Aktif</SelectItem>
                <SelectItem value="pending">Tertunda</SelectItem>
                <SelectItem value="closed">Tutup</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center">
              <span className="mr-2">Pesan</span>
              <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></div>
            </CardTitle>
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
                    <Avatar className={message.role === 'ai' ? 'border-2 border-cyan-500' : 'border-2 border-purple-500'}>
                      <AvatarImage src={message.role === 'ai' ? '/ai-avatar.png' : '/user-avatar.png'} />
                      <AvatarFallback className={message.role === 'ai' ? 'bg-cyan-900 text-cyan-200' : 'bg-purple-900 text-purple-200'}>
                        {message.role === 'ai' ? 'AI' : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-lg p-3 ${
                        message.role === 'ai' 
                          ? 'bg-gradient-to-r from-cyan-800 to-blue-900 text-white border border-cyan-700' 
                          : 'bg-gradient-to-r from-slate-700 to-slate-800 border border-slate-600'
                      }`}
                    >
                      <p>{message.content}</p>
                      {message.role === 'ai' && (
                        <div className="text-xs mt-1 opacity-70">
                          {message.ai_profile && <span>Dikirim oleh {message.ai_profile.name} | </span>}
                          {message.template && <span>Menggunakan template: {message.template.title} | </span>}
                          {message.training_data && <span>Berdasarkan training: {message.training_data.title} | </span>}
                          <span>{new Date(message.timestamp!).toLocaleTimeString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-[300px] text-slate-400">
                  <div className="rounded-full bg-slate-800 p-6 mb-4 border border-slate-700">
                    <Send className="h-8 w-8 text-cyan-400" />
                  </div>
                  <p className="text-lg">Belum ada pesan</p>
                  <p className="text-sm">Mulai percakapan dengan mengirim pesan pertama</p>
                </div>
              )}
            </ScrollArea>
            <div className="flex flex-col space-y-2 mt-4">
              <div className="flex space-x-2">
                <Select
                  value={selectedAIProfile || ''}
                  onValueChange={(value) => setSelectedAIProfile(value)}
                >
                  <SelectTrigger className="w-[200px] bg-slate-800 border-slate-600">
                    <SelectValue placeholder="Pilih Profil AI" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
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
                  <SelectTrigger className="w-[200px] bg-slate-800 border-slate-600">
                    <SelectValue placeholder="Pilih Template" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
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
                  <SelectTrigger className="w-[200px] bg-slate-800 border-slate-600">
                    <SelectValue placeholder="Pilih Data Training" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
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
                  placeholder="Ketik pesan..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="bg-slate-800 border-slate-600 focus:border-cyan-500"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={sendMessageMutation.isPending || !newMessage.trim()}
                  className="bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600"
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
