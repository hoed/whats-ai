
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Check, PhoneOff } from 'lucide-react';

const SetupWhatsApp = () => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleNextStep = () => {
    if (step === 1 && !phoneNumber) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    if (step === 2 && !verifyCode) {
      toast({
        title: "Error",
        description: "Please enter the verification code",
        variant: "destructive",
      });
      return;
    }

    if (step === 1) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setStep(2);
        toast({
          title: "Code sent",
          description: "Verification code has been sent to your WhatsApp",
        });
      }, 1500);
    } else if (step === 2) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setStep(3);
        toast({
          title: "Success",
          description: "WhatsApp account successfully connected!",
        });
      }, 1500);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Connect WhatsApp Account</h1>
        
        <div className="mb-8">
          <ol className="flex items-center w-full">
            <li className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>
              <span className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                {step > 1 ? <Check className="h-4 w-4" /> : "1"}
              </span>
              <span className="hidden sm:inline-block mx-2 text-sm">Enter Phone</span>
            </li>
            <div className="flex-grow border-t border-gray-200 mx-2"></div>
            <li className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>
              <span className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                {step > 2 ? <Check className="h-4 w-4" /> : "2"}
              </span>
              <span className="hidden sm:inline-block mx-2 text-sm">Verify</span>
            </li>
            <div className="flex-grow border-t border-gray-200 mx-2"></div>
            <li className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-500'}`}>
              <span className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                {step >= 3 ? <Check className="h-4 w-4" /> : "3"}
              </span>
              <span className="hidden sm:inline-block mx-2 text-sm">Complete</span>
            </li>
          </ol>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Enter Your WhatsApp Number</CardTitle>
              <CardDescription>
                We'll send a verification code to this WhatsApp number.
                Make sure you have WhatsApp installed and active.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="phone">WhatsApp Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+62 812 3456 7890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Enter your full phone number with country code.
                  </p>
                </div>
                <Button onClick={handleNextStep} disabled={isSubmitting}>
                  {isSubmitting ? "Sending code..." : "Send Verification Code"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Enter Verification Code</CardTitle>
              <CardDescription>
                We've sent a verification code to your WhatsApp.
                Check your messages and enter the code below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Didn't receive a code? <Button variant="link" className="p-0 h-auto">Resend code</Button>
                  </p>
                </div>
                <Button onClick={handleNextStep} disabled={isSubmitting}>
                  {isSubmitting ? "Verifying..." : "Verify Code"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                Connected Successfully
              </CardTitle>
              <CardDescription>
                Your WhatsApp account has been successfully connected to the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-green-800">
                  <h3 className="font-medium mb-1">WhatsApp Connected</h3>
                  <p className="text-sm">
                    Connected number: {phoneNumber || "+62 812 3456 7890"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    <PhoneOff className="h-4 w-4 mr-2" />
                    Disconnect
                  </Button>
                  <Button onClick={() => window.location.href = '/'}>
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
      </div>
    </DashboardLayout>
  );
};

export default SetupWhatsApp;
