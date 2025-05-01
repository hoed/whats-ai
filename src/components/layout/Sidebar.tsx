import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  MessageSquare,
  Users,
  FileText,
  Database,
  Settings,
  BarChart2,
  Star,
  BookOpen,
  X,
  BookMarked,
  Mic
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const menuItems = [
    { label: 'Chat Sessions', icon: <MessageSquare size={20} />, path: '/chats' },
    { label: 'Contacts', icon: <Users size={20} />, path: '/contacts' },
    { label: 'Templates', icon: <FileText size={20} />, path: '/templates' },
    { label: 'AI Profiles', icon: <Star size={20} />, path: '/ai-profiles' },
    { label: 'Training', icon: <BookOpen size={20} />, path: '/training' },
    { label: 'Analytics', icon: <BarChart2 size={20} />, path: '/analytics' },
    { label: 'Manual', icon: <BookMarked size={20} />, path: '/manual' },
    { label: 'Voice Settings', icon: <Mic size={20} />, path: '/voice-settings' },
    { label: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];
  
  return (
    <aside className={`
      fixed lg:static inset-y-0 left-0 z-30 w-64 
      bg-gray-50 border-r border-gray-200
      transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      lg:translate-x-0 transition-transform duration-300 ease-in-out
      flex flex-col
    `}>
      <div className="flex justify-between items-center p-4 lg:hidden">
        <span className="text-lg font-bold">Menu</span>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={20} />
        </Button>
      </div>
      
      <div className="p-4 flex-grow overflow-y-auto">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? 'default' : 'ghost'}
              className={`w-full justify-start ${
                isActive(item.path) ? 'bg-brand-blue hover:bg-brand-blue/90' : ''
              }`}
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </Button>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 pb-2">Connected WhatsApp Number</div>
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          <span className="text-sm">+62 812 3456 7890</span>
        </div>
        <div className="mt-2 text-xs text-gray-400">Status: Active</div>
      </div>
    </aside>
  );
};

export default Sidebar;
