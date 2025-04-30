
import React, { useState } from 'react';
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
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Dashboard
            </h1>
            <p className="text-slate-400">Selamat datang di pusat kontrol WhatsApp Business</p>
          </div>
          <Button 
            onClick={() => navigate('/setup-whatsapp')}
            className="bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 shadow-lg shadow-cyan-900/20"
          >
            <Plus className="h-4 w-4 mr-2" />
            Hubungkan WhatsApp
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Percakapan" 
            value={stats?.total_conversations || 0}
            icon={<MessageSquare className="h-4 w-4 text-cyan-400" />}
            className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-lg hover:shadow-xl transition-shadow border-b-4 border-b-cyan-600"
          />
          <StatCard 
            title="Percakapan Aktif" 
            value={stats?.active_conversations || 0}
            icon={<UserCheck className="h-4 w-4 text-green-400" />}
            className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-lg hover:shadow-xl transition-shadow border-b-4 border-b-green-600"
          />
          <StatCard 
            title="Percakapan Selesai" 
            value={stats?.resolved_conversations || 0}
            icon={<CheckCircle className="h-4 w-4 text-blue-400" />}
            className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-lg hover:shadow-xl transition-shadow border-b-4 border-b-blue-600"
          />
          <StatCard 
            title="Kontak Baru Hari Ini" 
            value={stats?.new_contacts_today || 0}
            icon={<Clock className="h-4 w-4 text-purple-400" />}
            className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-lg hover:shadow-xl transition-shadow border-b-4 border-b-purple-600"
            description="Pelanggan baru dalam 24 jam terakhir"
          />
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur border border-slate-700 rounded-lg shadow-lg">
          <div className="p-4 border-b border-slate-700 backdrop-blur">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-cyan-400">Percakapan Terbaru</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/chat')}
                className="border-slate-600 hover:bg-slate-700 text-slate-300"
              >
                Lihat Semua
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Cari berdasarkan nama atau nomor telepon..."
                  className="pl-8 bg-slate-700/50 backdrop-blur border-slate-600 focus:border-cyan-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="all" onValueChange={setStatusFilter}>
            <div className="px-4 border-b border-slate-700 backdrop-blur">
              <TabsList className="w-full justify-start bg-slate-800">
                <TabsTrigger value="all" className="data-[state=active]:bg-cyan-700 data-[state=active]:text-white">Semua</TabsTrigger>
                <TabsTrigger value="open" className="data-[state=active]:bg-green-700 data-[state=active]:text-white">Aktif</TabsTrigger>
                <TabsTrigger value="pending" className="data-[state=active]:bg-amber-700 data-[state=active]:text-white">Tertunda</TabsTrigger>
                <TabsTrigger value="closed" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">Ditutup</TabsTrigger>
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
