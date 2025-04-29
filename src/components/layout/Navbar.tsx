import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bell, Settings, HelpCircle, LogIn, Menu, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthDialog from '@/components/auth/AuthDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
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

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="flex justify-between items-center px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center"
          >
            <span className="text-brand-blue text-lg sm:text-xl font-bold">WhatsAI</span>
            <span className="text-brand-green text-lg sm:text-xl font-bold">Service</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/settings')}
          >
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>
          
          {user ? (
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="p-2"
            >
              <LogOut className="h-5 w-5 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              onClick={() => setShowAuthDialog(true)}
              className="p-2"
            >
              <LogIn className="h-5 w-5 sm:mr-2" />
              <span className="hidden sm:inline">Login</span>
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