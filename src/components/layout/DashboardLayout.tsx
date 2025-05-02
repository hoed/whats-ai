
import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useTheme } from '@/contexts/ThemeContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { darkMode } = useTheme();

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-grow overflow-hidden">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
