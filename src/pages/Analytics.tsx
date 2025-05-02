
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, parseISO, subDays } from 'date-fns';
import { Message } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';

const getLastSevenDays = () => {
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i);
    result.push({
      date: format(date, 'yyyy-MM-dd'),
      displayDate: format(date, 'MMM dd')
    });
  }
  return result;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7', '#ec4899'];

const Analytics = () => {
  const [messageData, setMessageData] = useState<any[]>([]);
  const [messageTypes, setMessageTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all messages
        const { data: messages, error } = await supabase
          .from('messages')
          .select('*');
        
        if (error) throw error;
        
        // Process data for the last 7 days chart
        const days = getLastSevenDays();
        const messagesByDay = days.map(day => {
          const count = messages?.filter((message: Message) => {
            // Use timestamp instead of created_at
            const messageDate = format(parseISO(message.timestamp || ''), 'yyyy-MM-dd');
            return messageDate === day.date;
          }).length || 0;
          
          return {
            name: day.displayDate,
            messages: count
          };
        });
        
        // Process data for the message types pie chart
        const messageTypesCounts: Record<string, number> = {};
        messages?.forEach((message: Message) => {
          const type = message.role || 'unknown';
          messageTypesCounts[type] = (messageTypesCounts[type] || 0) + 1;
        });
        
        const messageTypesData = Object.keys(messageTypesCounts).map(key => ({
          name: key,
          value: messageTypesCounts[key]
        }));
        
        setMessageData(messagesByDay);
        setMessageTypes(messageTypesData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, []);

  // Define styles based on dark mode
  const chartBgClass = darkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-900';
  const chartTextColor = darkMode ? '#ffffff' : '#1f2937';
  const gridColor = darkMode ? '#475569' : '#e5e7eb';
  const pageBgClass = darkMode ? 'bg-slate-900' : 'bg-gray-100';
  const textClass = darkMode ? 'text-white' : 'text-gray-900';
  const tabsClass = darkMode ? 'bg-slate-800' : 'bg-gray-200';
  const tabActiveClass = darkMode ? 'data-[state=active]:bg-slate-700' : 'data-[state=active]:bg-white';

  return (
    <DashboardLayout>
      <div className={`p-8 ${pageBgClass} min-h-screen`}>
        <h1 className={`text-3xl font-bold mb-6 ${textClass}`}>Analytics Dashboard</h1>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className={`grid w-full grid-cols-3 ${tabsClass}`}>
            <TabsTrigger value="overview" className={`${textClass} ${tabActiveClass}`}>Overview</TabsTrigger>
            <TabsTrigger value="messages" className={`${textClass} ${tabActiveClass}`}>Messages</TabsTrigger>
            <TabsTrigger value="contacts" className={`${textClass} ${tabActiveClass}`}>Contacts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className={chartBgClass}>
                <CardHeader>
                  <CardTitle className={textClass}>Messages Last 7 Days</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className={`h-80 flex items-center justify-center ${textClass}`}>Loading...</div>
                  ) : (
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={messageData}>
                        <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                        <XAxis dataKey="name" stroke={chartTextColor} />
                        <YAxis stroke={chartTextColor} />
                        <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1f2937' : '#ffffff', borderColor: gridColor }} />
                        <Legend />
                        <Bar dataKey="messages" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              
              <Card className={chartBgClass}>
                <CardHeader>
                  <CardTitle className={textClass}>Message Types</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className={`h-80 flex items-center justify-center ${textClass}`}>Loading...</div>
                  ) : (
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={messageTypes}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {messageTypes.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1f2937' : '#ffffff', borderColor: gridColor }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="messages">
            <Card className={chartBgClass}>
              <CardHeader>
                <CardTitle className={textClass}>Message Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={textClass}>Detailed message analytics will be available soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contacts">
            <Card className={chartBgClass}>
              <CardHeader>
                <CardTitle className={textClass}>Contact Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={textClass}>Detailed contact analytics will be available soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
