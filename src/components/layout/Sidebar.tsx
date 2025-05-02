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
import { useTheme } from '@/contexts/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useTheme();
  
  const isActive = (path: string) => location.pathname === path;
  
  const bgColor = darkMode ? 'bg-slate-900' : 'bg-gray-50';
  const borderColor = darkMode ? 'border-slate-700' : 'border-gray-200';
  const textColor = darkMode ? 'text-gray-200' : 'text-gray-900';
  const menuActiveColor = darkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-brand-blue hover:bg-brand-blue/90';
  const menuInactiveColor = darkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100';
  const phoneStatusBg = darkMode ? 'bg-slate-800' : 'bg-white';
  const phoneStatusText = darkMode ? 'text-gray-300' : 'text-gray-900';
  const phoneStatusDetailText = darkMode ? 'text-gray-400' : 'text-gray-400';
  
  const menuItems = [
    { label: 'Chat Sessions', icon: <MessageSquare size={20} />, path: '/chats' },
    { label: 'Contacts', icon: <Users size={20} />, path: '/contacts' },
    { label: 'Templates', icon: <FileText size={20} />, path: '/templates' },
    { label: 'AI Profiles', icon: <Star size={20} />, path: '/ai-profiles' },
    { label: 'Voice Settings', icon: <Mic size={20} />, path: '/voice-settings' },
    { label: 'Training', icon: <BookOpen size={20} />, path: '/training' },
    { label: 'Analytics', icon: <BarChart2 size={20} />, path: '/analytics' },
    { label: 'Settings', icon: <Settings size={20} />, path: '/settings' },
    { label: 'Manual', icon: <BookMarked size={20} />, path: '/manual' },
  ];
  
  return (
    <aside className={`
      fixed lg:static inset-y-0 left-0 z-10 w-64
      ${bgColor} ${borderColor} border-r
      transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      lg:translate-x-0 transition-transform duration-300 ease-in-out
      flex flex-col
      lg:w-64 md:w-56 sm:w-48 w-40
    `}>
      <div className={`flex justify-between items-center p-4 lg:hidden ${borderColor} border-b`}>
        <span className={`text-lg font-bold ${textColor}`}>Menu</span>
        <Button variant="ghost" size="icon" onClick={onClose}
          className={darkMode ? "text-gray-300 hover:text-white hover:bg-slate-700" : ""}>
          <X size={20} />
        </Button>
      </div>
      
      <div className="p-4 flex-grow overflow-y-auto">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? 'default' : 'ghost'}
              className={`w-full justify-start ${textColor} ${
                isActive(item.path) ? menuActiveColor : menuInactiveColor
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
      
      <div className={`p-4 ${borderColor} border-t`}>
        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} pb-2`}>Connected WhatsApp Number</div>
        <div className={`flex items-center space-x-2 p-2 rounded-md ${phoneStatusBg}`}>
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          <span className={`text-sm ${phoneStatusText}`}>+62 812 3456 7890</span>
        </div>
        <div className={`mt-2 text-xs ${phoneStatusDetailText}`}>Status: Active</div>
      </div>
    </aside>
  );
};

export default Sidebar;