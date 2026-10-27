import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {DarkTheme, DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';

import {WishlistProvider} from './src/context/WishlistContext';
import {ThemeProvider, useTheme} from './src/context/ThemeContext';

import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>

        <Provider store={store}><ThemeProvider><ThemedApp /></ThemeProvider></Provider>

      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const ThemedApp = () => {
  const {isDark} = useTheme();
  const dark = isDark;
  const baseTheme = dark ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: '#ef4444',
      background: dark ? '#111827' : '#f4f4f4',
      card: dark ? '#1f2937' : '#fff',
      text: dark ? '#f8fafc' : '#111',
      border: dark ? '#334155' : '#e2e8f0',
      notification: '#ef4444',
    },
  };
  return <>
    <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
    <WishlistProvider><NavigationContainer theme={navigationTheme}><AppNavigator /></NavigationContainer></WishlistProvider>
  </>;
};

export default App;
