
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUserSettings } from '@/hooks/use-user-settings';

type ThemeContextType = {
  darkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, updateSettings, isLoading } = useUserSettings();
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Initialize dark mode from user settings or local storage
  useEffect(() => {
    if (!isLoading && settings) {
      setDarkMode(settings.dark_mode);
    } else {
      // Use localStorage as fallback when settings are not available
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        setDarkMode(true);
      } else if (savedTheme === 'light') {
        setDarkMode(false);
      } else {
        // Use system preference as default
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(prefersDark);
        localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
      }
    }
    setMounted(true);
  }, [settings, isLoading]);

  // Update the HTML class when dark mode changes
  useEffect(() => {
    if (!mounted) return;
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode, mounted]);

  // Toggle theme function
  const toggleTheme = async () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    // Save to user settings if available
    if (settings) {
      try {
        await updateSettings({ dark_mode: newDarkMode });
      } catch (error) {
        console.error('Failed to update theme in settings:', error);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
