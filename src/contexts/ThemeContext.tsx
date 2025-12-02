'use client';

import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes';

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <ThemeContextWrapper>{children}</ThemeContextWrapper>
    </NextThemesProvider>
  );
};

const ThemeContextWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDarkMode = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  // Avoid hydration mismatch by rendering nothing until mounted, 
  // or render children but with a default value (though children might depend on theme).
  // However, next-themes handles the class on html, so UI components relying on CSS classes will work.
  // Components relying on `darkMode` boolean might need to wait.
  // But for now, let's return the context.

  const darkMode = mounted ? resolvedTheme === 'dark' : false;

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to access theme context
 * Must be used within a ThemeProvider
 * @throws Error if used outside of ThemeProvider
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Fallback if used outside (though it shouldn't be) or if we want to use next-themes directly
    // But for backward compatibility, we throw or return a default.
    // Let's try to use next-themes directly if context is missing, but the interface is different.
    // So we stick to the context.
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
