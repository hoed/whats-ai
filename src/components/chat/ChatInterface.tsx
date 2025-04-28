
import React, { useState, useEffect, useRef } from 'react';
import { Message, Contact, AIProfile, Template } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, PlusCircle } from 'lucide-react';
import ChatMessage from './ChatMessage';
import TemplateSelector from './TemplateSelector';
import { useToast } from '@/components/ui/use-toast';

interface ChatInterfaceProps {
  contact: Contact | undefined;
  messages: Message[];
  aiProfiles: AIProfile[];
  templates: Template[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onChangeAIProfile: (profileId: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  contact,
  messages,
  aiProfiles,
  templates,
  isLoading,
  onSendMessage,
  onChangeAIProfile,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<string | undefined>(
    aiProfiles.length > 0 ? aiProfiles[0].id : undefined
  );
  const [showTemplates, setShowTemplates] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleProfileChange = (value: string) => {
    setSelectedProfile(value);
    onChangeAIProfile(value);
    
    toast({
      title: "AI Profile Changed",
      description: `AI Persona switched to ${aiProfiles.find(p => p.id === value)?.name || "Unknown"}`,
    });
  };

  const handleTemplateSelect = (templateContent: string) => {
    // Replace placeholders with actual values if available
    let content = templateContent;
    if (contact) {
      content = content.replace(/{name}/g, contact.name || 'Customer');
    }
    
    setNewMessage(content);
    setShowTemplates(false);
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="border-b px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-blue to-brand-green flex items-center justify-center text-white font-medium">
              {contact ? contact.name.charAt(0) : '?'}
            </div>
            <CardTitle className="ml-3">
              <div className="text-lg">{contact ? contact.name : 'Unknown Customer'}</div>
              <div className="text-xs text-gray-500 font-normal">
                {contact ? contact.phone_number : 'No phone number'}
              </div>
            </CardTitle>
          </div>
          <div className="w-48">
            <Select 
              value={selectedProfile} 
              onValueChange={handleProfileChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select AI Persona" />
              </SelectTrigger>
              <SelectContent>
                {aiProfiles.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id}>
                    {profile.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <div className="animate-pulse-light">Loading conversation...</div>
            </div>
          ) : messages.length > 0 ? (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-gray-500">No messages yet.</p>
              <p className="text-sm text-gray-400">Start the conversation by sending a message below.</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {showTemplates && (
        <CardContent className="p-2 border-t">
          <TemplateSelector 
            templates={templates} 
            onSelect={handleTemplateSelect} 
            onClose={() => setShowTemplates(false)}
          />
        </CardContent>
      )}
      
      <CardFooter className="border-t p-2">
        <div className="flex w-full items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            type="button"
            onClick={() => setShowTemplates(!showTemplates)}
          >
            <PlusCircle className="h-5 w-5 text-gray-500" />
          </Button>
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            className="flex-grow resize-none"
            rows={1}
          />
          <Button type="button" onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
