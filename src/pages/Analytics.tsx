
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchStats } from '@/services/supabase';
import {
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

const Analytics = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
  });

  const mockData = [
    { name: 'Mon', conversations: 4, resolved: 3 },
    { name: 'Tue', conversations: 3, resolved: 2 },
    { name: 'Wed', conversations: 7, resolved: 5 },
    { name: 'Thu', conversations: 5, resolved: 4 },
    { name: 'Fri', conversations: 6, resolved: 5 },
    { name: 'Sat', conversations: 2, resolved: 2 },
    { name: 'Sun', conversations: 3, resolved: 2 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-green">
            Analytics Dashboard
          </h1>
          <p className="text-gray-500">Monitor your WhatsApp business metrics</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_conversations || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Active Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.active_conversations || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.total_conversations 
                  ? Math.round((stats.resolved_conversations / stats.total_conversations) * 100)
                  : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1 border-none shadow-lg bg-white/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-[300px]" config={{}}>
                <LineChart data={mockData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="conversations" 
                    stroke="#0284c7" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="resolved" 
                    stroke="#10b981" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="col-span-1 border-none shadow-lg bg-white/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Conversation Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-[300px]" config={{}}>
                <BarChart data={mockData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="conversations" fill="#0284c7" />
                  <Bar dataKey="resolved" fill="#10b981" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
