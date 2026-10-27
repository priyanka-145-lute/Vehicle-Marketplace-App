/* eslint-env jest */
import React from 'react';
import {act, create} from 'react-test-renderer';
import {Alert, FlatList, Text, TextInput, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MySalesScreen from '../src/screens/MySalesScreen';

jest.mock('@react-native-async-storage/async-storage', () => ({getItem: jest.fn(), setItem: jest.fn()}));

jest.mock('../src/redux/api', () => ({
  useGetCountriesQuery: jest.fn(() => ({currentData: {success: true, data: [{CountryID: 1, CountryName: 'India'}]}})),
  useGetStatesQuery: jest.fn(() => ({currentData: {success: true, data: [{StateID: 1, StateName: 'Maharashtra'}]}})),
  useGetCitiesQuery: jest.fn(() => ({currentData: {success: true, data: [{CityID: 1, CityName: 'Nagpur'}]}})),
  useGetAreasQuery: jest.fn(() => ({currentData: {success: true, data: [{AreaID: 10, AreaName: 'Ayodhya Nagar', Pincode: '440024'}]}})),
}));

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native-safe-area-context', () => ({SafeAreaView: require('react-native').View}));

const press = async (tree, label) => {
  const target = tree.root.findAllByType(TouchableOpacity).find(node => node.props.accessibilityLabel === label || node.findAllByType(Text).some(text => React.Children.toArray(text.props.children).join('') === label));
  await act(async () => target.props.onPress());
};
const fill = async (tree, label, value) => {
  await act(async () => tree.root.findAllByType(TextInput).find(node => node.props.accessibilityLabel === label).props.onChangeText(value));
};
beforeEach(() => {
  jest.clearAllMocks();
  AsyncStorage.getItem.mockResolvedValue(null);
  AsyncStorage.setItem.mockResolvedValue(undefined);
});

test('creates, edits, marks sold, restores and deletes a listing', async () => {
  let tree;
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  await act(async () => {tree = create(<MySalesScreen />);});
  await press(tree, '+ Sell Vehicle');
  await fill(tree, 'Vehicle name *', 'Honda City');
  await fill(tree, 'Price (₹) *', '650000');
  await fill(tree, 'Model year *', '2024');
  await fill(tree, 'Fuel type *', 'Petrol');
  for (const label of ['Select Country', 'Country: India', 'Select State', 'State: Maharashtra', 'Select City', 'City: Nagpur', 'Select Area', 'Area: Ayodhya Nagar']) {await press(tree, label);}
  await press(tree, 'Save Listing');
  expect(tree.root.findByType(FlatList).props.data[0].title).toBe('Honda City');
  await press(tree, 'Edit');
  await fill(tree, 'Price (₹) *', '620000');
  await press(tree, 'Save Changes');
  await press(tree, 'Mark as Sold');
  await act(async () => alert.mock.calls.at(-1)[2][1].onPress());
  await press(tree, 'Active (0)');
  expect(tree.root.findByType(FlatList).props.data).toHaveLength(0);
  const saved = AsyncStorage.setItem.mock.calls.at(-1)[1];
  expect(JSON.parse(saved)[0]).toMatchObject({price: 620000, status: 'Sold', location: 'Ayodhya Nagar, Nagpur, Maharashtra', locationDetails: {countryId: 1, stateId: 1, cityId: 1, areaId: 10, pincode: '440024'}});
  await act(async () => tree.unmount());
  AsyncStorage.getItem.mockResolvedValue(saved);
  await act(async () => {tree = create(<MySalesScreen />);});
  expect(tree.root.findByType(FlatList).props.data).toHaveLength(1);
  await press(tree, 'Delete');
  await act(async () => alert.mock.calls.at(-1)[2][1].onPress());
  expect(tree.root.findByType(FlatList).props.data).toHaveLength(0);
  await act(async () => tree.unmount());
  alert.mockRestore();
});

test('failed deletion preserves the listing and reports the storage error', async () => {
  AsyncStorage.getItem.mockResolvedValue(JSON.stringify([{id: '1', title: 'Bike', price: 10000, status: 'Active'}]));
  AsyncStorage.setItem.mockRejectedValue(new Error('Storage full'));
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  let tree;
  await act(async () => {tree = create(<MySalesScreen />);});
  await press(tree, 'Delete');
  await act(async () => alert.mock.calls.at(-1)[2][1].onPress());
  expect(tree.root.findByType(FlatList).props.data).toHaveLength(1);
  expect(alert).toHaveBeenLastCalledWith('Could not save', expect.any(String));
  await act(async () => tree.unmount());
  alert.mockRestore();
});
