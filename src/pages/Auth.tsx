import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Bot } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setShowAuthDialog } = useAuth();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const redirectTo = searchParams.get('redirect') || '/dashboard';

  useEffect(() => {
    // Prevent AuthDialog from showing on /auth
    setShowAuthDialog(false);

    // Check if user is already logged in
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate(redirectTo, { replace: true });
      }
    };
    
    checkUser();
  }, [navigate, redirectTo, setShowAuthDialog]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Pendaftaran berhasil",
        description: "Silakan periksa email Anda untuk konfirmasi.",
      });
      setActiveTab('login');
    } catch (error: any) {
      toast({
        title: "Kesalahan pendaftaran",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      navigate(redirectTo, { replace: true });
    } catch (error: any) {
      toast({
        title: "Kesalahan login",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500"></div>
        
        <div className="absolute inset-0" 
          style={{ 
            backgroundImage: 'linear-gradient(rgba(66, 71, 112, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(66, 71, 112, 0.1) 1px, transparent 1px)', 
            backgroundSize: '30px 30px',
            perspective: '1000px',
            transform: 'rotateX(60deg) scale(4) translateZ(-10px)',
            transformOrigin: 'center bottom',
            backgroundPosition: 'center center'
          }}>
        </div>
        
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="z-10 w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex items-center mb-4">
            <Bot className="w-10 h-10 text-blue-400 mr-3" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              AIConverse
            </h1>
          </div>
          <p className="text-gray-400">Hubungkan WhatsApp Anda dengan AI untuk dukungan pelanggan yang luar biasa</p>
        </div>

        <Card className="border border-gray-600 bg-gray-900/80 backdrop-blur-sm shadow-lg hover:shadow-blue-400/20 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-center text-gray-100">Selamat datang</CardTitle>
            <CardDescription className="text-center text-gray-400">Login atau daftar untuk melanjutkan</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-600">
                <TabsTrigger value="login" className="text-gray-100 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">Login</TabsTrigger>
                <TabsTrigger value="register" className="text-gray-100 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">Daftar</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-login" className="text-gray-100">Email</Label>
                    <Input
                      id="email-login"
                      type="email"
                      placeholder="nama@perusahaan.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password-login" className="text-gray-100">Password</Label>
                      <Button 
                        variant="link" 
                        className="px-0 text-xs text-blue-300"
                        type="button" 
                        onClick={() => toast({
                          title: "Reset Password",
                          description: "Fitur reset password akan segera hadir.",
                        })}
                      >
                        Lupa password?
                      </Button>
                    </div>
                    <div className="relative">
                      <Input
                        id="password-login"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-300"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                    disabled={loading}
                  >
                    {loading ? "Memproses..." : "Login"}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="register">
                <form onSubmit={handleSignUp} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-register" className="text-gray-100">Email</Label>
                    <Input
                      id="email-register"
                      type="email"
                      placeholder="nama@perusahaan.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-register" className="text-gray-100">Password</Label>
                    <div className="relative">
                      <Input
                        id="password-register"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-300"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                    disabled={loading}
                  >
                    {loading ? "Memproses..." : "Daftar"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center w-full">
              <Button 
                variant="outline" 
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800" 
                onClick={() => navigate('/')}
              >
                Kembali ke Beranda
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;