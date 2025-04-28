import React from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type ChatSession = Database['public']['Tables']['chat_sessions']['Row'];
type Message = Database['public']['Tables']['messages']['Row'];

// Fetch analytics data
const fetchAnalytics = async () => {
  const { data: sessions, error: sessionsError } = await supabase
    .from('chat_sessions')
    .select('*');
  if (sessionsError) {
    console.error('Error fetching chat sessions for analytics:', sessionsError);
    throw new Error(sessionsError.message);
  }
  console.log('Fetched chat sessions for analytics:', sessions);

  const { data: messages, error: messagesError } = await supabase
    .from('messages')
    .select('*');
  if (messagesError) {
    console.error('Error fetching messages for analytics:', messagesError);
    throw new Error(messagesError.message);
  }
  console.log('Fetched messages for analytics:', messages);

  return { sessions, messages };
};

const Analytics = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics'],
    queryFn: fetchAnalytics,
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-red-500">Error: {(error as Error).message}</div>
      </DashboardLayout>
    );
  }

  const { sessions = [], messages = [] } = data || {};

  // Basic metrics
  const totalSessions = sessions.length;
  const openSessions = sessions.filter(s => s.status === 'open').length;
  const totalMessages = messages.length;
  const aiMessages = messages.filter(m => m.role === 'ai').length;

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Chat Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalSessions}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Open Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{openSessions}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalMessages}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>AI Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{aiMessages}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;