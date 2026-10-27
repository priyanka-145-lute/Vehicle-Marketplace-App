/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {useStore} from 'react-redux';
import App from '../App';
import {store} from '../src/redux/store';

jest.mock('react-native-keychain', () => ({}));
jest.mock('@react-native-async-storage/async-storage', () => ({getItem: jest.fn().mockResolvedValue(null)}));
jest.mock('react-native-gesture-handler', () => ({GestureHandlerRootView: require('react-native').View}));
jest.mock('react-native-safe-area-context', () => ({SafeAreaProvider: require('react-native').View}));
jest.mock('@react-navigation/native', () => ({
  DarkTheme: {colors: {}}, DefaultTheme: {colors: {}}, NavigationContainer: require('react-native').View,
}));
jest.mock('../src/context/WishlistContext', () => ({WishlistProvider: require('react-native').View}));
jest.mock('../src/navigation/AppNavigator', () => ({__esModule: true, default: jest.fn(() => null)}));

test('provides the configured Redux store to app screens', async () => {
  const AppNavigator = require('../src/navigation/AppNavigator').default;
  let providedStore;
  AppNavigator.mockImplementation(() => {providedStore = useStore(); return null;});
  let tree: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {tree = ReactTestRenderer.create(<App />);});
  expect(providedStore).toBe(store);
  await ReactTestRenderer.act(async () => tree.unmount());
});
