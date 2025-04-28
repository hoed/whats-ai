
import React, { useState } from 'react';
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
    
    if (diffSeconds < 60) return `${diffSeconds} seconds ago`;
    
    const diffMinutes = Math.round(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    
    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.round(diffHours / 24);
    return `${diffDays} days ago`;
  };
  
  const getStatusBadge = (status: 'open' | 'pending' | 'closed') => {
    switch (status) {
      case 'open':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>;
      case 'closed':
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      {isLoading ? (
        // Loading state with skeleton cards
        Array(3).fill(0).map((_, index) => (
          <Card key={`skeleton-${index}`} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col space-y-2">
                  <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        sessions.map((session) => (
          <Card 
            key={session.id}
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/chat/${session.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <span className="font-medium">{session.contact?.name || 'Unknown'}</span>
                    {session.contact?.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="ml-2 text-xs">{tag}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <MessageSquare size={14} className="mr-1" />
                    <span>{session.contact?.phone_number}</span>
                    <Clock size={14} className="ml-3 mr-1" />
                    <span>{formatTimeAgo(session.last_activity)}</span>
                    {session.assigned_to && (
                      <>
                        <UserCheck size={14} className="ml-3 mr-1" />
                        <span>{session.assigned_to}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  {getStatusBadge(session.status)}
                  <ChevronRight size={16} className="ml-2 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
      
      {!isLoading && sessions.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8">
          <MessageSquare className="h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium">No active sessions</h3>
          <p className="text-sm text-gray-500">When customers message you, they'll appear here.</p>
        </div>
      )}
    </div>
  );
};

export default ChatSessionList;
