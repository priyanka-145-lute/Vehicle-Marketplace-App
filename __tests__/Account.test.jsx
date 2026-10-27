/* eslint-env jest */
import React from 'react';
import {act, create} from 'react-test-renderer';
import {Alert, Linking, Text, TextInput, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AccountNavigator, {AccountLogoutContext} from '../src/screens/AccountScreens';

jest.mock('@react-native-async-storage/async-storage', () => ({getItem: jest.fn(), setItem: jest.fn()}));

jest.mock('../src/redux/api', () => ({
  useGetCountriesQuery: jest.fn(() => ({currentData: {success: true, data: [{CountryID: 1, CountryName: 'India'}]}})),
  useGetStatesQuery: jest.fn(() => ({currentData: {success: true, data: [{StateID: 1, StateName: 'Maharashtra'}]}})),
  useGetCitiesQuery: jest.fn(() => ({currentData: {success: true, data: [{CityID: 1, CityName: 'Nagpur'}]}})),
  useGetAreasQuery: jest.fn(() => ({currentData: {success: true, data: [{AreaID: 10, AreaName: 'Ayodhya Nagar', Pincode: '440024'}]}})),
}));

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native-safe-area-context', () => ({SafeAreaView: require('react-native').View}));
jest.mock('@react-navigation/native-stack', () => {
  const ReactModule = require('react');
  return {createNativeStackNavigator: () => ({
    Navigator: ({children}) => {
      const [history, setHistory] = ReactModule.useState(['AccountHome']);
      const name = history[history.length - 1];
      const route = ReactModule.Children.toArray(children).find(child => child.props.name === name);
      return ReactModule.createElement(route.props.component, {navigation: {navigate: next => setHistory(current => [...current, next]), goBack: () => setHistory(current => current.slice(0, -1)), canGoBack: () => history.length > 1}, route: {name}});
    },
    Screen: () => null,
  })};
});
const press = async (tree, label) => {
  const target = tree.root.findAllByType(TouchableOpacity).find(node => node.props.accessibilityLabel === label || node.findAllByType(Text).some(text => text.props.children === label));
  await act(async () => target.props.onPress());
};
beforeEach(() => {jest.clearAllMocks(); AsyncStorage.getItem.mockResolvedValue(null); AsyncStorage.setItem.mockResolvedValue(undefined);});

test('contact buttons open the supplied number and handle unavailable apps', async () => {
  const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  let tree;
  await act(async () => {tree = create(<AccountNavigator />);});
  await press(tree, 'Contact Us');
  await press(tree, 'Call 8149709394');
  expect(openURL).toHaveBeenLastCalledWith('tel:+918149709394');
  await press(tree, 'WhatsApp 8149709394');
  expect(openURL).toHaveBeenLastCalledWith('https://wa.me/918149709394');
  openURL.mockRejectedValueOnce(new Error('No dialer'));
  await press(tree, 'Call 8149709394');
  expect(alert).toHaveBeenLastCalledWith('Could not open the dialer', expect.stringContaining('8149709394'));
  await act(async () => tree.unmount());
  openURL.mockRestore();
  alert.mockRestore();
});

test('profile validates, saves, appears on Account and restores after reopening', async () => {
  let tree;
  await act(async () => {tree = create(<AccountNavigator />);});
  await press(tree, 'My Profile');
  await press(tree, 'Edit Profile');
  await press(tree, 'Save Changes');
  expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  await act(async () => tree.root.findAllByType(TextInput).find(node => node.props.accessibilityLabel === 'Full name *').props.onChangeText('Asha Patil'));
  for (const label of ['Select Country', 'Country: India', 'Select State', 'State: Maharashtra', 'Select City', 'City: Nagpur', 'Select Area', 'Area: Ayodhya Nagar']) {await press(tree, label);}
  await press(tree, 'Save Changes');
  const saved = AsyncStorage.setItem.mock.calls.at(-1)[1];
  expect(JSON.parse(saved)).toMatchObject({name: 'Asha Patil', city: 'Nagpur', locationDetails: {countryId: 1, stateId: 1, cityId: 1, areaId: 10, pincode: '440024'}});
  await press(tree, 'Go back');
  expect(tree.root.findAllByType(Text).some(node => node.props.children === 'Asha Patil')).toBe(true);
  await act(async () => tree.unmount());
  AsyncStorage.getItem.mockResolvedValue(saved);
  await act(async () => {tree = create(<AccountNavigator />);});
  expect(tree.root.findAllByType(Text).some(node => node.props.children === 'Asha Patil')).toBe(true);
  await press(tree, 'My Profile');
  await press(tree, 'Edit Profile');
  expect(tree.root.findAllByType(Text).some(node => node.props.children === 'Ayodhya Nagar')).toBe(true);
  await act(async () => tree.unmount());
});

test('support and policy routes open and logout requires confirmation', async () => {
  const logout = jest.fn();
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  let tree;
  await act(async () => {tree = create(<AccountLogoutContext.Provider value={logout}><AccountNavigator /></AccountLogoutContext.Provider>);});
  for (const title of ['Contact Us', 'Privacy Policy', 'Terms & Conditions']) {
    await press(tree, title);
    expect(tree.root.findAllByType(Text).some(node => node.props.children === title)).toBe(true);
    await press(tree, 'Go back');
  }
  await press(tree, 'Log Out');
  expect(logout).not.toHaveBeenCalled();
  await act(async () => alert.mock.calls.at(-1)[2][1].onPress());
  expect(logout).toHaveBeenCalledTimes(1);
  await act(async () => tree.unmount());
  alert.mockRestore();
});
