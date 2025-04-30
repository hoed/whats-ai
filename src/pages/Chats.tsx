
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ChatSessionList from '@/components/dashboard/ChatSessionList';
import { fetchChatSessions } from '@/services/supabase';
import { Filter, Search } from 'lucide-react';

const Chats = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'pending' | 'closed'>('all');

  const { data: chatSessions = [], isLoading, error } = useQuery({
    queryKey: ['chatSessions'],
    queryFn: fetchChatSessions,
  });

  const filteredSessions = chatSessions.filter((session) => {
    const matchesSearch = 
      !searchQuery || 
      session.contact?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.contact?.phone_number?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSessionSelect = (sessionId: string) => {
    navigate(`/chat/${sessionId}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Percakapan WhatsApp</h1>
          <Button 
            onClick={() => navigate('/setup-whatsapp')}
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
          >
            Pengaturan WhatsApp
          </Button>
        </div>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Cari berdasarkan nama atau nomor telepon..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'open' | 'pending' | 'closed')}
              className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">Semua Status</option>
              <option value="open">Aktif</option>
              <option value="pending">Tertunda</option>
              <option value="closed">Tutup</option>
            </select>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Daftar Percakapan</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="py-8 text-center">
                <p className="text-red-500">Terjadi kesalahan saat memuat data percakapan.</p>
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-500">Tidak ada percakapan yang ditemukan.</p>
              </div>
            ) : (
              <ChatSessionList 
                sessions={filteredSessions} 
                onSessionSelect={handleSessionSelect} 
              />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Chats;
