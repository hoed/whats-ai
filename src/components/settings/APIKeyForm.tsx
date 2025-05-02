
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Check, Loader2, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface APIKeyFormProps {
  title: string;
  description: string;
  apiKeyLabel: string;
  apiKeyName: string;
  apiKeyPlaceholder: string;
  initialValue?: string;
  onSave: (value: string) => Promise<void> | void;
  isLoading?: boolean;
}

const APIKeyForm: React.FC<APIKeyFormProps> = ({
  title,
  description,
  apiKeyLabel,
  apiKeyName,
  apiKeyPlaceholder,
  initialValue = '',
  onSave,
  isLoading = false,
}) => {
  const [apiKey, setApiKey] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { darkMode } = useTheme();
  
  // Initialize with prop value when available
  useEffect(() => {
    if (initialValue) {
      setApiKey(initialValue);
    }
  }, [initialValue]);
  
  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSaving(true);
      await onSave(apiKey);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save API key",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const maskedValue = apiKey ? 
    apiKey.substring(0, 4) + '•'.repeat(Math.max(0, apiKey.length - 8)) + apiKey.substring(apiKey.length - 4) : 
    '';
  
  // Define color classes based on dark mode state
  const cardClass = darkMode 
    ? "border-blue-700 bg-slate-800 backdrop-blur-sm" 
    : "border-blue-200 bg-blue-50 backdrop-blur-sm";
  
  const titleClass = darkMode ? "text-white" : "text-blue-900";
  const descriptionClass = darkMode ? "text-gray-300" : "text-blue-700";
  const labelClass = darkMode ? "text-gray-300" : "text-blue-800";
  const inputClass = darkMode 
    ? "bg-slate-700 border-slate-600 text-white placeholder:text-gray-400" 
    : "bg-white border-blue-200 text-blue-900";
  const buttonClass = darkMode 
    ? "bg-blue-600 hover:bg-blue-700 text-white" 
    : "bg-blue-500 hover:bg-blue-600 text-white";
  const iconButtonClass = darkMode
    ? "bg-slate-700 border-slate-600 hover:bg-slate-600"
    : "bg-white border-blue-200 hover:bg-blue-50";
  const iconClass = darkMode ? "text-gray-300" : "text-blue-500";
  const hintTextClass = darkMode ? "text-gray-400" : "text-blue-600";
  
  return (
    <Card className={cardClass}>
      <CardHeader>
        <CardTitle className={titleClass}>{title}</CardTitle>
        <CardDescription className={descriptionClass}>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor={apiKeyName} className={labelClass}>{apiKeyLabel}</Label>
            <div className="flex items-center">
              <Input
                id={apiKeyName}
                type={isVisible ? "text" : "password"}
                placeholder={apiKeyPlaceholder}
                value={isVisible ? apiKey : (apiKey ? maskedValue : '')}
                onChange={(e) => setApiKey(e.target.value)}
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
            <p className={`text-xs ${hintTextClass}`}>
              {initialValue ? (
                <span className="flex items-center text-green-500">
                  <Check className="h-4 w-4 mr-1" /> API Key is set up
                </span>
              ) : (
                "API key will be stored securely in Supabase."
              )}
            </p>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || isLoading}
            className={`w-full ${buttonClass}`}
          >
            {isSaving || isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Saving...
              </>
            ) : initialValue ? "Update API Key" : "Save API Key"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default APIKeyForm;
