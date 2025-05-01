
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Settings, User, PhoneCall } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Welcome to WhatsApp AI Assistant</h1>
          <p className="text-gray-500">Connect your WhatsApp account to get started</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-none shadow hover:shadow-lg transition-all cursor-pointer" 
                onClick={() => navigate('/chats')}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-blue-600">
                <MessageSquare className="h-5 w-5 mr-2" />
                Chat Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">View and manage your WhatsApp conversations</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-none shadow hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate('/contacts')}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-green-600">
                <User className="h-5 w-5 mr-2" />
                Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Manage your WhatsApp contacts</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-none shadow hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate('/voice-settings')}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-purple-600">
                <PhoneCall className="h-5 w-5 mr-2" />
                Voice Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Configure AI voice for WhatsApp calls</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-none shadow hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate('/settings')}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-amber-600">
                <Settings className="h-5 w-5 mr-2" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Configure API keys and application settings</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="pt-4">
          <Button
            onClick={() => navigate('/setup-whatsapp')}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
          >
            Set Up WhatsApp Connection
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
