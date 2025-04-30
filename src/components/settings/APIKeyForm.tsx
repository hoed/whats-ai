
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Check, Loader2, Eye, EyeOff } from 'lucide-react';

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
  
  return (
    <Card className="border border-blue-900/20 bg-blue-950/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-blue-100">{title}</CardTitle>
        <CardDescription className="text-blue-200/70">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor={apiKeyName} className="text-blue-100">{apiKeyLabel}</Label>
            <div className="flex items-center">
              <Input
                id={apiKeyName}
                type={isVisible ? "text" : "password"}
                placeholder={apiKeyPlaceholder}
                value={isVisible ? apiKey : (apiKey ? maskedValue : '')}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-blue-950/30 border-blue-900/50 text-blue-100"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="ml-2 bg-blue-950/30 border-blue-900/50 hover:bg-blue-900/30"
                onClick={() => setIsVisible(!isVisible)}
              >
                {isVisible ? <EyeOff className="h-4 w-4 text-blue-300" /> : <Eye className="h-4 w-4 text-blue-300" />}
              </Button>
            </div>
            <p className="text-xs text-blue-200/70">
              {initialValue ? (
                <span className="flex items-center text-green-400">
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
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
