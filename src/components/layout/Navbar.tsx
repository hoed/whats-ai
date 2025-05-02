
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bell, Settings, HelpCircle, LogIn, Menu, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthDialog from '@/components/auth/AuthDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { darkMode } = useTheme();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Success",
      description: "You have been logged out successfully.",
    });
    navigate('/');
  };

  // Define text color classes based on dark mode
  const textClass = darkMode ? "text-gray-100" : "text-gray-800";
  const logoTextClass = "text-lg sm:text-xl font-bold";

  return (
    <header className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-20 transition-colors duration-200`}>
      <div className="flex justify-between items-center px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className={`h-5 w-5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`} />
          </Button>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center"
          >
            <span className="text-brand-blue text-lg sm:text-xl font-bold">AI</span>
            <span className="text-brand-green text-lg sm:text-xl font-bold">Converse</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button variant="ghost" size="icon">
            <Bell className={`h-5 w-5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/settings')}
          >
            <Settings className={`h-5 w-5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`} />
          </Button>
          <Button variant="ghost" size="icon">
            <HelpCircle className={`h-5 w-5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`} />
          </Button>
          
          {user ? (
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className={`p-2 ${darkMode ? 'hover:bg-slate-700 text-gray-200' : 'hover:bg-gray-100'}`}
            >
              <LogOut className={`h-5 w-5 sm:mr-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`} />
              <span className={`hidden sm:inline ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Logout</span>
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              onClick={() => setShowAuthDialog(true)}
              className={`p-2 ${darkMode ? 'hover:bg-slate-700 text-gray-200' : 'hover:bg-gray-100'}`}
            >
              <LogIn className={`h-5 w-5 sm:mr-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`} />
              <span className={`hidden sm:inline ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Login</span>
            </Button>
          )}
        </div>
      </div>
      
      <AuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)} 
      />
    </header>
  );
};

export default Navbar;
