import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './hooks/useAuth';
import Navigation from './navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
      <StatusBar style="light" />
    </AuthProvider>
  );
}
