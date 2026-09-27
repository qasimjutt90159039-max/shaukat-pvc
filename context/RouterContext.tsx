import React, { createContext, useContext, useState, useEffect } from 'react';

interface RouterContextType {
  path: string;
  navigate: (to: string) => void;
  query: Record<string, string>;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string) => {
    if (to === currentPath) return;
    window.history.pushState({}, '', to);
    setCurrentPath(to.split('?')[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Parse query parameters
  const searchParams = new URLSearchParams(window.location.search);
  const query: Record<string, string> = {};
  searchParams.forEach((val, key) => {
    query[key] = val;
  });

  return (
    <RouterContext.Provider value={{ path: currentPath, navigate, query }}>
      {children}
    </RouterContext.Provider>
  );
};

export function useRouter(): RouterContextType {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}
