
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Check, Loader2, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { saveTwilioKeys, getTwilioKeys } from '@/services/supabase';

interface TwilioCredentials {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
}

const TwilioAPIForm: React.FC = () => {
  const [credentials, setCredentials] = useState<TwilioCredentials>({
    accountSid: '',
    authToken: '',
    phoneNumber: ''
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);
  const { toast } = useToast();
  const { darkMode } = useTheme();
  
  // Load Twilio credentials on mount
  useEffect(() => {
    const loadCredentials = async () => {
      try {
        setIsLoading(true);
        const twilioData = await getTwilioKeys();
        
        if (twilioData) {
          setCredentials({
            accountSid: twilioData.account_sid || '',
            authToken: twilioData.auth_token || '',
            phoneNumber: twilioData.phone_number || ''
          });
          setIsConfigured(true);
        }
      } catch (error: any) {
        console.error("Error loading Twilio credentials:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCredentials();
  }, []);
  
  const handleChange = (field: keyof TwilioCredentials) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };
  
  const handleSave = async () => {
    if (!credentials.accountSid.trim() || !credentials.authToken.trim()) {
      toast({
        title: "Error",
        description: "Please enter both Account SID and Auth Token",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSaving(true);
      await saveTwilioKeys(credentials);
      
      toast({
        title: "Success",
        description: "Twilio credentials saved successfully",
      });
      setIsConfigured(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save Twilio credentials",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Define color classes based on dark mode state for better visibility
  const cardClass = darkMode 
    ? "border-blue-700 bg-slate-800" 
    : "border-blue-200 bg-blue-50";
  
  const titleClass = darkMode ? "text-white" : "text-blue-900";
  const descriptionClass = darkMode ? "text-gray-300" : "text-blue-700";
  const labelClass = darkMode ? "text-gray-300" : "text-blue-800";
  const inputClass = darkMode 
    ? "bg-slate-700 border-slate-600 text-white placeholder:text-gray-400" 
    : "bg-white border-blue-200 text-blue-900 placeholder:text-blue-300";
  const buttonClass = darkMode 
    ? "bg-blue-600 hover:bg-blue-700 text-white" 
    : "bg-blue-500 hover:bg-blue-600 text-white";
  const iconButtonClass = darkMode
    ? "bg-slate-700 border-slate-600 hover:bg-slate-600 text-white"
    : "bg-white border-blue-200 hover:bg-blue-50";
  const iconClass = darkMode ? "text-gray-300" : "text-blue-500";
  const hintTextClass = darkMode ? "text-gray-400" : "text-blue-600";
  
  const maskedToken = credentials.authToken ? 
    credentials.authToken.substring(0, 4) + '•'.repeat(Math.max(0, credentials.authToken.length - 8)) + 
    credentials.authToken.substring(credentials.authToken.length - 4) : '';
  
  return (
    <Card className={cardClass}>
      <CardHeader>
        <CardTitle className={titleClass}>Twilio WhatsApp Integration</CardTitle>
        <CardDescription className={descriptionClass}>
          Connect to WhatsApp using Twilio integration for customer engagement.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="accountSid" className={labelClass}>Account SID</Label>
            <Input
              id="accountSid"
              type="text"
              placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={credentials.accountSid}
              onChange={handleChange('accountSid')}
              className={inputClass}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="authToken" className={labelClass}>Auth Token</Label>
            <div className="flex items-center">
              <Input
                id="authToken"
                type={isVisible ? "text" : "password"}
                placeholder="Enter your Twilio Auth Token"
                value={isVisible ? credentials.authToken : (credentials.authToken ? maskedToken : '')}
                onChange={handleChange('authToken')}
                className={inputClass}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className={`ml-2 ${iconButtonClass}`}
                onClick={() => setIsVisible(!isVisible)}
              >
                {isVisible ? <EyeOff className={`h-4 w-4 ${iconClass}`} /> : <Eye className={`h-4 w-4 ${iconClass}`} />}
              </Button>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="phoneNumber" className={labelClass}>WhatsApp Phone Number</Label>
            <Input
              id="phoneNumber"
              type="text"
              placeholder="+1234567890"
              value={credentials.phoneNumber}
              onChange={handleChange('phoneNumber')}
              className={inputClass}
            />
            <p className={`text-xs ${hintTextClass}`}>
              Format with country code (e.g., +1 for US)
            </p>
          </div>
          
          {isConfigured && (
            <p className={`text-xs flex items-center text-green-500`}>
              <Check className="h-4 w-4 mr-1" /> Twilio connection is set up
            </p>
          )}
          
          <Button 
            onClick={handleSave} 
            disabled={isSaving || isLoading}
            className={`w-full ${buttonClass} mt-2`}
          >
            {isSaving || isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Saving...
              </>
            ) : isConfigured ? "Update Twilio Settings" : "Save Twilio Settings"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TwilioAPIForm;
