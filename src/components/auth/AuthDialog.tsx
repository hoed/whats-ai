import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthDialog = ({ isOpen, onClose }: AuthDialogProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "You have been logged in successfully.",
        });
        
        onClose();
        navigate(redirectTo, { replace: true });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Please check your email to confirm your account.",
        });
        setIsLogin(true); // Switch to login after signup
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[90vw] sm:max-w-md p-4 sm:p-6 bg-gray-900/80 border border-gray-600 backdrop-blur-sm text-gray-100">
        <DialogHeader>
          <DialogTitle className="text-2xl sm:text-3xl">
            {isLogin ? 'Login' : 'Sign Up'}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {isLogin ? 'Welcome back!' : 'Create a new account'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-100">Email</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              />
              <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-100">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:gap-4">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsLogin(!isLogin)}
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;