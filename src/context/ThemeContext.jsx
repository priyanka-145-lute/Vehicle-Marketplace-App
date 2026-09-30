import React, {createContext, useContext} from 'react';
import {useColorScheme} from 'react-native';

const ThemeContext = createContext({isDark: false});

export const ThemeProvider = ({children}) => {
  const isDark = useColorScheme() === 'dark';
  return <ThemeContext.Provider value={{isDark}}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
