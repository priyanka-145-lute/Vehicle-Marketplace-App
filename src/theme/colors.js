import {useMemo} from 'react';
import {useTheme} from '../context/ThemeContext';

export const lightColors = {
  background: '#f4f4f4', surface: '#ffffff', surfaceMuted: '#f1f5f9',
  text: '#111827', textMuted: '#64748b', border: '#e2e8f0',
  accentSurface: '#fff1f2',
};
export const darkColors = {
  background: '#111827', surface: '#1f2937', surfaceMuted: '#334155',
  text: '#f8fafc', textMuted: '#cbd5e1', border: '#475569',
  accentSurface: '#3b202b',
};
export const useThemeStyles = createStyles => {
  const {isDark} = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const styles = useMemo(() => createStyles(colors), [createStyles, colors]);
  return {colors, styles};
};
