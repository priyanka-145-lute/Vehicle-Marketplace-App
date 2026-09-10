import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext({isDark: false, setIsDark: () => {}});
const THEME_KEY = 'vehicle-dark-mode';

export const ThemeProvider = ({children}) => {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {AsyncStorage.getItem(THEME_KEY).then(value => setIsDark(value === 'true')).catch(() => {});}, []);
  const updateTheme = async value => {
    setIsDark(value);
    try {await AsyncStorage.setItem(THEME_KEY, String(value));} catch {}
  };
  return <ThemeContext.Provider value={{isDark, setIsDark: updateTheme}}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
