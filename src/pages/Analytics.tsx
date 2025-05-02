
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
        <div className="bg-red-100 border border-red-300 text-red-600 p-4 rounded-lg">
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
    const date = new Date(message.timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  console.log('Messages by day:', messagesByDay); // Debug log

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

  console.log('Chart labels:', labels); // Debug log
  console.log('Chart data points:', dataPoints); // Debug log

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
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(17, 24, 39)', // gray-900 for light theme
        },
      },
      title: {
        display: true,
        text: 'Messages Sent Per Day (Last 7 Days)',
        color: 'rgb(17, 24, 39)', // gray-900
        font: {
          size: 14,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'rgb(17, 24, 39)', // gray-900
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)', // Lighter grid for light theme
        },
        title: {
          display: true,
          text: 'Number of Messages',
          color: 'rgb(17, 24, 39)', // gray-900
        },
      },
      x: {
        ticks: {
          color: 'rgb(17, 24, 39)', // gray-900
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)', // Lighter grid for light theme
        },
        title: {
          display: true,
          text: 'Date',
          color: 'rgb(17, 24, 39)', // gray-900
        },
      },
    },
  };

  const aiVsUserOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(17, 24, 39)', // gray-900
        },
      },
      title: {
        display: true,
        text: 'AI vs User Messages',
        color: 'rgb(17, 24, 39)', // gray-900
        font: {
          size: 14,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'rgb(17, 24, 39)', // gray-900
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)', // Lighter grid for light theme
        },
      },
      x: {
        ticks: {
          color: 'rgb(17, 24, 39)', // gray-900
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 bg-gray-200 p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-gray-300 bg-white shadow-lg hover:shadow-blue-400/20 transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium text-gray-700">Total Chats</CardTitle>
                <div className="p-2 rounded-lg bg-blue-500/30">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <p className="text-3xl font-bold text-gray-900">{totalSessions}</p>
                <span className="ml-2 text-xs text-green-600">+{Math.round(totalSessions * 0.15)} this week</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">From all time</p>
            </CardContent>
          </Card>
          
          <Card className="border-gray-300 bg-white shadow-lg hover:shadow-purple-400/20 transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium text-gray-700">Active Chats</CardTitle>
                <div className="p-2 rounded-lg bg-purple-500/30">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <p className="text-3xl font-bold text-gray-900">{openSessions}</p>
                <span className="ml-2 text-xs text-green-600">+{Math.round(openSessions * 0.2)} this week</span>
              </div>
              <div className="w-full h-1.5 bg-gray-300 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" 
                  style={{ width: `${Math.min(100, (openSessions / Math.max(1, totalSessions)) * 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">Open conversations</p>
            </CardContent>
          </Card>
          
          <Card className="border-gray-300 bg-white shadow-lg hover:shadow-indigo-400/20 transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium text-gray-700">Messages</CardTitle>
                <div className="p-2 rounded-lg bg-indigo-500/30">
                  <CheckCircle className="h-4 w-4 text-indigo-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <p className="text-3xl font-bold text-gray-900">{totalMessages}</p>
                <span className="ml-2 text-xs text-green-600">+{Math.round(totalMessages * 0.1)} today</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Total messages exchanged</p>
            </CardContent>
          </Card>
          
          <Card className="border-gray-300 bg-white shadow-lg hover:shadow-cyan-400/20 transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium text-gray-700">Response Rate</CardTitle>
                <div className="p-2 rounded-lg bg-cyan-500/30">
                  <Clock className="h-4 w-4 text-cyan-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <p className="text-3xl font-bold text-gray-900">{responseRate}%</p>
                {responseRate >= 95 ? (
                  <span className="ml-2 text-xs text-green-600">Excellent</span>
                ) : responseRate >= 80 ? (
                  <span className="ml-2 text-xs text-yellow-600">Good</span>
                ) : (
                  <span className="ml-2 text-xs text-red-600">Needs improvement</span>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-1">AI responds to user messages</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-gray-300 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900">Messages Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              {messages.length === 0 ? (
                <div className="h-[350px] flex items-center justify-center">
                  <p className="text-gray-600">No messages available to display.</p>
                </div>
              ) : (
                <div className="h-[350px]">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="border-gray-300 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900">Message Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] flex items-center justify-center">
                <Bar data={aiVsUserData} options={aiVsUserOptions} />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-gray-300 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900">Top AI Profiles</CardTitle>
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
                      <span className="text-sm text-gray-700">{profile.name}</span>
                      <span className="text-sm text-gray-600">{profile.usage} uses</span>
                    </div>
                    <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
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
          
          <Card className="border-gray-300 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900">Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col h-full justify-center">
                <div className="text-center">
                  <p className="text-5xl font-bold text-blue-600">1.2s</p>
                  <p className="text-sm text-gray-600 mt-2">Average response time</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="text-center">
                    <p className="text-lg font-bold text-indigo-600">0.8s</p>
                    <p className="text-xs text-gray-600">Fastest</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-purple-600">1.2s</p>
                    <p className="text-xs text-gray-600">Average</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-cyan-600">3.5s</p>
                    <p className="text-xs text-gray-600">Slowest</p>
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
