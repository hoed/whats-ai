
import React from 'react';
import { Message } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const timestamp = new Date(message.timestamp);
  const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true });
  
  return (
    <div className={`whatsapp-bubble ${message.role}`}>
      <div className="mb-1 text-sm">{message.content}</div>
      <div className="text-right text-xs text-gray-500">{timeAgo}</div>
    </div>
  );
};

export default ChatMessage;
