import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

  // Prepare data for the chart: Messages per day
  const messagesByDay = messages.reduce((acc: { [key: string]: number }, message) => {
    const date = new Date(message.timestamp!).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  // Generate labels and data for the chart (last 7 days)
  const today = new Date();
  const labels: string[] = [];
  const dataPoints: number[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    labels.push(dateString);
    dataPoints.push(messagesByDay[dateString] || 0);
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Messages Sent',
        data: dataPoints,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Messages Sent Per Day (Last 7 Days)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Messages',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  };

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
        <Card>
          <CardHeader>
            <CardTitle>Messages Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;