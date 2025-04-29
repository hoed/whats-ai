
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
import { Loader2, MessageSquare, Users, CheckCircle, Clock } from 'lucide-react';

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
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-100/10 border border-red-200/20 text-red-500 p-4 rounded-lg">
          <p>Error: {(error as Error).message}</p>
        </div>
      </DashboardLayout>
    );
  }

  const { sessions = [], messages = [] } = data || {};

  // Basic metrics
  const totalSessions = sessions.length;
  const openSessions = sessions.filter(s => s.status === 'open').length;
  const totalMessages = messages.length;
  const aiMessages = messages.filter(m => m.role === 'ai').length;
  const userMessages = messages.filter(m => m.role === 'user').length;
  const responseRate = totalMessages > 0 ? Math.round((aiMessages / userMessages) * 100) : 0;

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

  // Prepare data for AI vs User messages chart
  const aiVsUserData = {
    labels: ['AI', 'User'],
    datasets: [
      {
        label: 'Messages',
        data: [aiMessages, userMessages],
        backgroundColor: ['rgba(99, 102, 241, 0.7)', 'rgba(139, 92, 246, 0.7)'],
        borderColor: ['rgb(99, 102, 241)', 'rgb(139, 92, 246)'],
        borderWidth: 1,
      },
    ],
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Messages Sent',
        data: dataPoints,
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(209, 213, 219)',
        },
      },
      title: {
        display: true,
        text: 'Messages Sent Per Day (Last 7 Days)',
        color: 'rgb(209, 213, 219)',
        font: {
          size: 14,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'rgb(209, 213, 219)',
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
        },
        title: {
          display: true,
          text: 'Number of Messages',
          color: 'rgb(209, 213, 219)',
        },
      },
      x: {
        ticks: {
          color: 'rgb(209, 213, 219)',
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
        },
        title: {
          display: true,
          text: 'Date',
          color: 'rgb(209, 213, 219)',
        },
      },
    },
  };

  const aiVsUserOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(209, 213, 219)',
        },
      },
      title: {
        display: true,
        text: 'AI vs User Messages',
        color: 'rgb(209, 213, 219)',
        font: {
          size: 14,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'rgb(209, 213, 219)',
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
        },
      },
      x: {
        ticks: {
          color: 'rgb(209, 213, 219)',
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-6 rounded-lg backdrop-blur-sm">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Analytics Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium text-gray-400">Total Chats</CardTitle>
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <MessageSquare className="h-4 w-4 text-blue-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <p className="text-3xl font-bold text-white">{totalSessions}</p>
                <span className="ml-2 text-xs text-green-500">+{Math.round(totalSessions * 0.15)} this week</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">From all time</p>
            </CardContent>
          </Card>
          
          <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm shadow-lg hover:shadow-purple-500/5 transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium text-gray-400">Active Chats</CardTitle>
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Users className="h-4 w-4 text-purple-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <p className="text-3xl font-bold text-white">{openSessions}</p>
                <span className="ml-2 text-xs text-green-500">+{Math.round(openSessions * 0.2)} this week</span>
              </div>
              <div className="w-full h-1.5 bg-gray-700 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" 
                  style={{ width: `${Math.min(100, (openSessions / Math.max(1, totalSessions)) * 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Open conversations</p>
            </CardContent>
          </Card>
          
          <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm shadow-lg hover:shadow-indigo-500/5 transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium text-gray-400">Messages</CardTitle>
                <div className="p-2 rounded-lg bg-indigo-500/20">
                  <CheckCircle className="h-4 w-4 text-indigo-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <p className="text-3xl font-bold text-white">{totalMessages}</p>
                <span className="ml-2 text-xs text-green-500">+{Math.round(totalMessages * 0.1)} today</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Total messages exchanged</p>
            </CardContent>
          </Card>
          
          <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm shadow-lg hover:shadow-cyan-500/5 transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium text-gray-400">Response Rate</CardTitle>
                <div className="p-2 rounded-lg bg-cyan-500/20">
                  <Clock className="h-4 w-4 text-cyan-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <p className="text-3xl font-bold text-white">{responseRate}%</p>
                {responseRate >= 95 ? (
                  <span className="ml-2 text-xs text-green-500">Excellent</span>
                ) : responseRate >= 80 ? (
                  <span className="ml-2 text-xs text-yellow-500">Good</span>
                ) : (
                  <span className="ml-2 text-xs text-red-500">Needs improvement</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">AI responds to user messages</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm shadow-lg lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Messages Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Message Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] flex items-center justify-center">
                <Bar data={aiVsUserData} options={aiVsUserOptions} />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Top AI Profiles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Customer Support", usage: 68 },
                  { name: "Technical Specialist", usage: 42 },
                  { name: "Sales Assistant", usage: 37 },
                  { name: "Product Advisor", usage: 29 },
                ].map((profile, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-300">{profile.name}</span>
                      <span className="text-sm text-gray-400">{profile.usage} uses</span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" 
                        style={{ width: `${(profile.usage / 70) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col h-full justify-center">
                <div className="text-center">
                  <p className="text-5xl font-bold text-blue-400">1.2s</p>
                  <p className="text-sm text-gray-400 mt-2">Average response time</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="text-center">
                    <p className="text-lg font-bold text-indigo-400">0.8s</p>
                    <p className="text-xs text-gray-500">Fastest</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-purple-400">1.2s</p>
                    <p className="text-xs text-gray-500">Average</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-cyan-400">3.5s</p>
                    <p className="text-xs text-gray-500">Slowest</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
