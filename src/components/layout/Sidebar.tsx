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
  BookOpen // Added new icon for Training
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const menuItems = [
    { label: 'Chat Sessions', icon: <MessageSquare size={20} />, path: '/' },
    { label: 'Contacts', icon: <Users size={20} />, path: '/contacts' },
    { label: 'Templates', icon: <FileText size={20} />, path: '/templates' },
    { label: 'AI Profiles', icon: <Star size={20} />, path: '/ai-profiles' },
    { label: 'Training', icon: <BookOpen size={20} />, path: '/training' }, // Added Training menu item
    { label: 'Analytics', icon: <BarChart2 size={20} />, path: '/analytics' },
    { label: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];
  
  return (
    <aside className="w-64 h-[calc(100vh-4rem)] border-r border-gray-200 bg-gray-50 flex flex-col">
      <div className="p-4 flex-grow">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? 'default' : 'ghost'}
              className={`w-full justify-start ${isActive(item.path) ? 'bg-brand-blue hover:bg-brand-blue/90' : ''}`}
              onClick={() => navigate(item.path)}
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