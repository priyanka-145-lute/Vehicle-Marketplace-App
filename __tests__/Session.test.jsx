/* eslint-env jest */
import React from 'react';
import {act, create} from 'react-test-renderer';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from '../src/navigation/AppNavigator';

jest.mock('@react-native-async-storage/async-storage', () => ({getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn()}));
jest.mock('../src/navigation/AuthStack', () => 'AuthStack');
jest.mock('../src/screens/AccountScreens', () => ({AccountLogoutContext: require('react').createContext(null)}));
jest.mock('../src/navigation/BottomTabs', () => {
  const ReactModule = require('react');
  const {AccountLogoutContext} = require('../src/screens/AccountScreens');
  return () => ReactModule.createElement('MainScreen', {logout: ReactModule.useContext(AccountLogoutContext)});
});
jest.mock('../src/screens/VehicleScreen', () => 'VehicleScreen');
jest.mock('../src/screens/AllTwoWheelersScreen', () => 'AllTwoWheelersScreen');
jest.mock('../src/screens/AllFourWheelersScreen', () => 'AllFourWheelersScreen');
jest.mock('../src/screens/AllOtherVehiclesScreen', () => 'AllOtherVehiclesScreen');
jest.mock('../src/screens/TwoWheelerDetailScreen', () => 'TwoWheelerDetailScreen');
jest.mock('@react-navigation/native-stack', () => ({createNativeStackNavigator: () => ({
  Navigator: ({children}) => {
    const ReactModule = require('react');
    return ReactModule.createElement(ReactModule.Children.toArray(children)[0].props.component);
  },
  Screen: () => null,
})}));
beforeEach(() => {
  jest.clearAllMocks();
  AsyncStorage.getItem.mockResolvedValue(null);
  AsyncStorage.setItem.mockResolvedValue(undefined);
  AsyncStorage.removeItem.mockResolvedValue(undefined);
});

test('login survives restarting and logout clears the saved session', async () => {
  let tree;
  await act(async () => {tree = create(<AppNavigator />);});
  await act(async () => tree.root.findByType('AuthStack').props.setIsLoggedIn(true));
  expect(AsyncStorage.setItem).toHaveBeenCalledWith('vehicle-login-session', 'logged-in');
  expect(tree.root.findAllByType('MainScreen')).toHaveLength(1);
  await act(async () => tree.unmount());
  AsyncStorage.getItem.mockResolvedValue('logged-in');
  await act(async () => {tree = create(<AppNavigator />);});
  expect(tree.root.findAllByType('AuthStack')).toHaveLength(0);
  await act(async () => tree.root.findByType('MainScreen').props.logout());
  expect(AsyncStorage.removeItem).toHaveBeenCalledWith('vehicle-login-session');
  expect(tree.root.findAllByType('AuthStack')).toHaveLength(1);
  await act(async () => tree.unmount());
  AsyncStorage.getItem.mockResolvedValue(null);
  await act(async () => {tree = create(<AppNavigator />);});
  expect(tree.root.findAllByType('AuthStack')).toHaveLength(1);
  await act(async () => tree.unmount());
});

test('does not show login before restoration finishes or log out when removal fails', async () => {
  let resolveSession;
  AsyncStorage.getItem.mockReturnValue(new Promise(resolve => {resolveSession = resolve;}));
  let tree;
  await act(async () => {tree = create(<AppNavigator />);});
  expect(tree.root.findAllByType('AuthStack')).toHaveLength(0);
  await act(async () => resolveSession('logged-in'));
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  AsyncStorage.removeItem.mockRejectedValue(new Error('Storage unavailable'));
  await act(async () => tree.root.findByType('MainScreen').props.logout());
  expect(tree.root.findAllByType('MainScreen')).toHaveLength(1);
  expect(alert).toHaveBeenCalledWith('Could not log out', 'Please try again.');
  await act(async () => tree.unmount());
  alert.mockRestore();
});
