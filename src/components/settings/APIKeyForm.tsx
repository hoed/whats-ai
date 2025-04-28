
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Check } from 'lucide-react';

interface APIKeyFormProps {
  title: string;
  description: string;
  apiKeyLabel: string;
  apiKeyName: string;
  apiKeyPlaceholder: string;
}

const APIKeyForm: React.FC<APIKeyFormProps> = ({
  title,
  description,
  apiKeyLabel,
  apiKeyName,
  apiKeyPlaceholder,
}) => {
  const [apiKey, setApiKey] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();
  
  const handleSave = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }
    
    // In a real implementation, this would save to Supabase
    console.log(`Saved ${apiKeyName}: ${apiKey}`);
    
    setIsSaved(true);
    setIsVisible(false);
    
    toast({
      title: "API Key Saved",
      description: `Your ${apiKeyName} has been saved successfully.`,
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor={apiKeyName}>{apiKeyLabel}</Label>
            <div className="flex items-center">
              <Input
                id={apiKeyName}
                type={isVisible ? "text" : "password"}
                placeholder={apiKeyPlaceholder}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                className="ml-2"
                onClick={() => setIsVisible(!isVisible)}
              >
                {isVisible ? "Hide" : "Show"}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              {isSaved ? (
                <span className="flex items-center text-green-500">
                  <Check className="h-4 w-4 mr-1" /> API Key is set up
                </span>
              ) : (
                "API key will be stored securely in Supabase."
              )}
            </p>
          </div>
          <Button onClick={handleSave} className="w-full">
            {isSaved ? "Update API Key" : "Save API Key"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default APIKeyForm;
