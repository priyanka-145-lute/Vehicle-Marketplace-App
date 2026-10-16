import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {Appearance} from 'react-native';

const THEME_KEY = 'gadi-dekho-dark-theme';
const ThemeContext = createContext({isDark: false, toggleTheme: () => {}});

export const ThemeProvider = ({children}) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then(value => setIsDark(value === 'true')).catch(() => {});
  }, []);

  useEffect(() => {
    Appearance.setColorScheme(isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = value => {
    setIsDark(value);
    AsyncStorage.setItem(THEME_KEY, String(value)).catch(() => {});
  };

  return <ThemeContext.Provider value={{isDark, toggleTheme}}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
