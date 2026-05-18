/**
 * frontend/src/context/AppProvider.tsx
 * 
 * Global provider for app-wide contexts and providers (Zustand, etc).
 */

import React, { ReactNode } from 'react';

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  // Add global providers here (e.g., ThemeProvider, ToastProvider)
  return <>{children}</>;
}
