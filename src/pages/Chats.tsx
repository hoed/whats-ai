import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import ChatSessionList from '@/components/dashboard/ChatSessionList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageSquare,
  UserCheck,
  Clock,
  CheckCircle,
  Search,
  Plus,
} from 'lucide-react';
import {
  fetchChatSessions,
  fetchStats
} from '@/services/supabase';

const Chats = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const { 
    data: sessions = [], 
    isLoading: isLoadingSessions
  } = useQuery({
    queryKey: ['chatSessions'],
    queryFn: fetchChatSessions
  });
  
  const { 
    data: stats, 
    isLoading: isLoadingStats
  } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats
  });

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = 
      !searchQuery || 
      session.contact?.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      session.contact?.phone_number.includes(searchQuery);
      
    const matchesStatus = 
      statusFilter === 'all' || 
      session.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-green">
              Dashboard
            </h1>
            <p className="text-gray-500">Welcome back to your WhatsApp Business Hub</p>
          </div>
          <Button 
            onClick={() => navigate('/setup-whatsapp')}
            className="bg-gradient-to-r from-brand-blue to-brand-green hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4 mr-2" />
            Connect WhatsApp
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Conversations" 
            value={stats?.total_conversations || 0}
            icon={<MessageSquare className="h-4 w-4" />}
            className="bg-gradient-to-br from-purple-50 to-blue-50 border-none shadow-lg hover:shadow-xl transition-shadow"
          />
          <StatCard 
            title="Active Conversations" 
            value={stats?.active_conversations || 0}
            icon={<UserCheck className="h-4 w-4" />}
            className="bg-gradient-to-br from-green-50 to-emerald-50 border-none shadow-lg hover:shadow-xl transition-shadow"
          />
          <StatCard 
            title="Closed Conversations" 
            value={stats?.resolved_conversations || 0}
            icon={<CheckCircle className="h-4 w-4" />}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 border-none shadow-lg hover:shadow-xl transition-shadow"
          />
          <StatCard 
            title="New Contacts Today" 
            value={stats?.new_contacts_today || 0}
            icon={<Clock className="h-4 w-4" />}
            className="bg-gradient-to-br from-pink-50 to-rose-50 border-none shadow-lg hover:shadow-xl transition-shadow"
            description="New customers in the last 24 hours"
          />
        </div>

        <div className="bg-white/50 backdrop-blur border rounded-lg shadow-lg">
          <div className="p-4 border-b backdrop-blur">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Recent Conversations</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/chat')}
                className="hover:bg-gray-100/50"
              >
                View All
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or phone number..."
                  className="pl-8 bg-white/50 backdrop-blur border-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="all" onValueChange={setStatusFilter}>
            <div className="px-4 border-b backdrop-blur">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="open">Active</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="closed">Closed</TabsTrigger>
              </TabsList>
            </div>
            
            {['all', 'open', 'pending', 'closed'].map((status) => (
              <TabsContent key={status} value={status} className="p-4 pt-2">
                <ChatSessionList 
                  sessions={filteredSessions} 
                  isLoading={isLoadingSessions}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chats;
