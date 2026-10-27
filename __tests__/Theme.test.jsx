/* eslint-env jest */
import React from 'react';
import {act, create} from 'react-test-renderer';
import {Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ThemeProvider, useTheme} from '../src/context/ThemeContext';
import {darkColors, lightColors, useThemeStyles} from '../src/theme/colors';

jest.mock('@react-native-async-storage/async-storage', () => ({getItem: jest.fn(), setItem: jest.fn()}));
const createStyles = colors => ({page: {backgroundColor: colors.background}, text: {color: colors.text}});
let theme;
const Screen = () => {
  theme = useTheme();
  const {colors, styles} = useThemeStyles(createStyles);
  return <View style={styles.page}><Text style={styles.text}>{colors.textMuted}</Text></View>;
};
beforeEach(() => {jest.clearAllMocks(); AsyncStorage.getItem.mockResolvedValue(null); AsyncStorage.setItem.mockResolvedValue(undefined);});
test('all mounted screens update both ways and save the selected theme', async () => {
  let tree;
  await act(async () => {tree = create(<ThemeProvider><Screen /><Screen /></ThemeProvider>);});
  for (const isDark of [true, false]) {
    await act(async () => theme.toggleTheme(isDark));
    const palette = isDark ? darkColors : lightColors;
    for (const screen of tree.root.findAllByType(Screen)) {
      expect(screen.findByType(View).props.style.backgroundColor).toBe(palette.background);
      expect(screen.findByType(Text).props.style.color).toBe(palette.text);
    }
    expect(AsyncStorage.setItem).toHaveBeenLastCalledWith('gadi-dekho-dark-theme', String(isDark));
  }
  await act(async () => tree.unmount());
});
test('restores dark theme after reopening', async () => {
  AsyncStorage.getItem.mockResolvedValue('true');
  let tree;
  await act(async () => {tree = create(<ThemeProvider><Screen /></ThemeProvider>);});
  expect(theme.isDark).toBe(true);
  expect(tree.root.findByType(View).props.style.backgroundColor).toBe(darkColors.background);
  await act(async () => tree.unmount());
});
test('a delayed restore cannot overwrite a user selection', async () => {
  let restore;
  AsyncStorage.getItem.mockReturnValue(new Promise(resolve => {restore = resolve;}));
  let tree;
  await act(async () => {tree = create(<ThemeProvider><Screen /></ThemeProvider>);});
  await act(async () => theme.toggleTheme(true));
  await act(async () => restore('false'));
  expect(theme.isDark).toBe(true);
  await act(async () => tree.unmount());
});
