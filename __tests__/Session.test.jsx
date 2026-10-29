/* eslint-env jest */
import React from 'react';
import {act, create} from 'react-test-renderer';
import {Alert} from 'react-native';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../src/redux/authSlice';
import {restoreSession, saveSession, clearSession} from '../src/redux/authSlice';
import AppNavigator from '../src/navigation/AppNavigator';
import {api} from '../src/redux/api';
jest.mock('@react-native-async-storage/async-storage', () => ({getItem: jest.fn(), setItem: jest.fn()}));

jest.mock('react-native-keychain', () => ({}));
jest.mock('../src/redux/authSlice', () => ({__esModule: true, ...jest.requireActual('../src/redux/authSlice'), restoreSession: jest.fn(), saveSession: jest.fn(), clearSession: jest.fn()}));
jest.mock('../src/redux/api', () => ({api: {endpoints: {logout: {initiate: jest.fn()}}, util: {resetApiState: () => ({type: 'api/resetApiState'})}}}));
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
jest.mock('../src/screens/PartsScreen', () => 'PartsScreen');
jest.mock('../src/screens/NotificationsScreen', () => 'NotificationsScreen');
jest.mock('../src/screens/ServicesScreen', () => 'ServicesScreen');
jest.mock('../src/screens/ServiceDetailsScreen', () => 'ServiceDetailsScreen');
jest.mock('../src/screens/PreferencesScreens', () => ({HelpSupportScreen: 'HelpSupportScreen', SavedSearchesScreen: 'SavedSearchesScreen'}));
const session = {accessToken: 'test-access', refreshToken: 'test-refresh', accessTokenExpiresAt: '2099-01-01T00:00:00Z'};
const renderApp = () => create(<Provider store={configureStore({reducer: {auth: authReducer}})}><AppNavigator /></Provider>);
jest.mock('@react-navigation/native-stack', () => ({createNativeStackNavigator: () => ({
  Navigator: ({children}) => {
    const ReactModule = require('react');
    return ReactModule.createElement(ReactModule.Children.toArray(children)[0].props.component);
  },
  Screen: () => null,
})}));
beforeEach(() => {
  jest.clearAllMocks();
  restoreSession.mockResolvedValue(null);
  saveSession.mockResolvedValue(undefined);
  clearSession.mockResolvedValue(undefined);
  api.endpoints.logout.initiate.mockImplementation(() => () => ({unwrap: async () => ({success: true}), reset: jest.fn()}));
});

test('login survives restarting and logout clears the saved session', async () => {
  let tree;
  await act(async () => {tree = renderApp();});
  await act(async () => tree.root.findByType('AuthStack').props.setIsLoggedIn(session));
  expect(saveSession).toHaveBeenCalledWith(session);
  expect(tree.root.findAllByType('MainScreen')).toHaveLength(1);
  await act(async () => tree.unmount());
  restoreSession.mockResolvedValue(session);
  await act(async () => {tree = renderApp();});
  expect(tree.root.findAllByType('AuthStack')).toHaveLength(0);
  await act(async () => tree.root.findByType('MainScreen').props.logout());
  expect(clearSession).toHaveBeenCalled();
  expect(api.endpoints.logout.initiate).toHaveBeenCalledWith({RefreshToken: session.refreshToken});
  expect(tree.root.findAllByType('AuthStack')).toHaveLength(1);
  await act(async () => tree.unmount());
  restoreSession.mockResolvedValue(null);
  await act(async () => {tree = renderApp();});
  expect(tree.root.findAllByType('AuthStack')).toHaveLength(1);
  await act(async () => tree.unmount());
});

test('does not show login before restoration finishes or log out when removal fails', async () => {
  let resolveSession;
  restoreSession.mockReturnValue(new Promise(resolve => {resolveSession = resolve;}));
  let tree;
  await act(async () => {tree = renderApp();});
  expect(tree.root.findAllByType('AuthStack')).toHaveLength(0);
  await act(async () => resolveSession(session));
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  clearSession.mockRejectedValue(new Error('Storage unavailable'));
  await act(async () => tree.root.findByType('MainScreen').props.logout());
  expect(tree.root.findAllByType('MainScreen')).toHaveLength(1);
  expect(alert).toHaveBeenCalledWith('Could not log out', 'Please try again.');
  await act(async () => tree.unmount());
  alert.mockRestore();
});

test('server logout failure still clears this device and reports the server failure', async () => {
  restoreSession.mockResolvedValue(session);
  api.endpoints.logout.initiate.mockImplementation(() => () => ({unwrap: async () => {throw new Error('Offline');}, reset: jest.fn()}));
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  let tree;
  await act(async () => {tree = renderApp();});
  await act(async () => tree.root.findByType('MainScreen').props.logout());
  expect(clearSession).toHaveBeenCalledTimes(1);
  expect(tree.root.findAllByType('AuthStack')).toHaveLength(1);
  expect(alert).toHaveBeenCalledWith('Logged out on this device', 'Could not confirm logout with the server.');
  await act(async () => tree.unmount()); alert.mockRestore();
});
