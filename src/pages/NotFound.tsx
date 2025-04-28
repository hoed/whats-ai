
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="max-w-md text-center px-6">
        <h1 className="text-6xl font-bold text-brand-blue mb-4">404</h1>
        <p className="text-xl mb-6">Oops! The page you're looking for cannot be found.</p>
        <p className="text-gray-500 mb-8">
          The page might be temporarily unavailable, moved, or no longer exist.
        </p>
        <Button onClick={() => navigate('/')} size="lg">
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
