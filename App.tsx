import 'react-native-gesture-handler';
import React from 'react';
import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';
import { AuthProvider } from './src/contexts/AuthContext';
import { CalendarProvider } from './src/contexts/CalendarContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CalendarProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </CalendarProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const AppContent = () => {
  const { colorMode } = useTheme();
  return (
    <>
      <AppNavigator />
      <StatusBar style={colorMode === 'dark' ? 'light' : 'dark'} />
    </>
  );
};



