
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatSession } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  MessageSquare,
  Clock,
  UserCheck,
  ChevronRight
} from 'lucide-react';

interface ChatSessionListProps {
  sessions: ChatSession[];
  isLoading: boolean;
}

const ChatSessionList: React.FC<ChatSessionListProps> = ({ sessions, isLoading }) => {
  const navigate = useNavigate();
  
  // Helper to format timestamp to relative time
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffSeconds = Math.round(diffMs / 1000);
    
    if (diffSeconds < 60) return `${diffSeconds} detik yang lalu`;
    
    const diffMinutes = Math.round(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes} menit yang lalu`;
    
    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    
    const diffDays = Math.round(diffHours / 24);
    return `${diffDays} hari yang lalu`;
  };
  
  const getStatusBadge = (status: 'open' | 'pending' | 'closed') => {
    switch (status) {
      case 'open':
        return <Badge className="bg-green-500 hover:bg-green-600">Aktif</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-500 border-amber-500 hover:text-amber-600 hover:border-amber-600">Tertunda</Badge>;
      case 'closed':
        return <Badge variant="secondary" className="bg-slate-700 hover:bg-slate-800">Ditutup</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      {isLoading ? (
        // Loading state with skeleton cards
        Array(3).fill(0).map((_, index) => (
          <Card key={`skeleton-${index}`} className="overflow-hidden bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col space-y-2">
                  <div className="h-6 w-40 bg-slate-700 rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-slate-700 rounded animate-pulse"></div>
                </div>
                <div className="h-6 w-20 bg-slate-700 rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        sessions.map((session) => (
          <Card 
            key={session.id}
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700 hover:border-cyan-700"
            onClick={() => navigate(`/chat/${session.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <span className="font-medium text-cyan-400">{session.contact?.name || 'Unknown'}</span>
                    {session.contact?.tags && session.contact.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="ml-2 text-xs border-slate-600 bg-slate-800">{tag}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center mt-1 text-xs text-slate-400">
                    <MessageSquare size={14} className="mr-1 text-cyan-500" />
                    <span>{session.contact?.phone_number}</span>
                    <Clock size={14} className="ml-3 mr-1 text-cyan-500" />
                    <span>{formatTimeAgo(session.last_activity)}</span>
                    {session.assigned_to && (
                      <>
                        <UserCheck size={14} className="ml-3 mr-1 text-cyan-500" />
                        <span>{session.assigned_to}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  {getStatusBadge(session.status)}
                  <ChevronRight size={16} className="ml-2 text-cyan-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
      
      {!isLoading && sessions.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-800 border border-slate-700 rounded-lg">
          <MessageSquare className="h-12 w-12 text-cyan-500" />
          <h3 className="mt-2 text-lg font-medium text-slate-300">Tidak ada sesi aktif</h3>
          <p className="text-sm text-slate-400">Ketika pelanggan mengirim pesan, mereka akan muncul di sini.</p>
        </div>
      )}
    </div>
  );
};

export default ChatSessionList;
