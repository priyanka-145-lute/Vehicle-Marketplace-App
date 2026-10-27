import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import {Appearance} from 'react-native';

const THEME_KEY = 'gadi-dekho-dark-theme';
const ThemeContext = createContext({isDark: false, toggleTheme: () => {}});

export const ThemeProvider = ({children}) => {
  const [isDark, setIsDark] = useState(false);
  const changed = useRef(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(THEME_KEY).then(value => {
      if (active && !changed.current) {setIsDark(value === 'true');}
    }).catch(() => {});
    return () => {active = false;};
  }, []);

  useEffect(() => {
    Appearance.setColorScheme(isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = value => {
    changed.current = true;
    setIsDark(value);
    AsyncStorage.setItem(THEME_KEY, String(value)).catch(() => {});
  };

  return <ThemeContext.Provider value={{isDark, toggleTheme}}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
