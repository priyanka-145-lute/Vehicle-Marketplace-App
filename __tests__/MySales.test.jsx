/* eslint-env jest */
import React from 'react';
import {act, create} from 'react-test-renderer';
import {Alert, FlatList, Platform, Switch, Text, TextInput, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MySalesScreen from '../src/screens/MySalesScreen';
import {keepLocalCopy, pick} from '@react-native-documents/picker';

jest.mock('@react-native-async-storage/async-storage', () => ({getItem: jest.fn(), setItem: jest.fn()}));
jest.mock('@react-native-documents/picker', () => ({pick: jest.fn(), keepLocalCopy: jest.fn()}));

jest.mock('../src/redux/api', () => ({
  useGetVehicleCategoriesQuery: jest.fn(() => ({currentData: {success: true, data: [{VehicleCategoryId: 2008, VEHICLETYPEID: 2000, VEHICLETYPENAME: 'Car', CATEGORYCODE: 'VC2005', CATEGORYNAME: 'SUV', ParentCategoryID: 0, CategoryLevel: 1}]}})),
  useGetVehicleTypesQuery: jest.fn(() => ({currentData: {success: true, data: [{VEHICLETYPEID: 2000, VEHICLETYPECODE: 'VT2001', VEHICLETYPENAME: 'Car'}, {VEHICLETYPEID: 2003, VEHICLETYPECODE: 'VT2003', VEHICLETYPENAME: 'Bike'}, {VEHICLETYPEID: 2006, VEHICLETYPECODE: 'VT2004', VEHICLETYPENAME: 'Scooter'}]}})),
  useGetBrandsQuery: jest.fn(() => ({currentData: {success: true, data: [{VehicleBrandId: 2003, VEHICLETYPEID: 2000, VEHICLETYPENAME: 'Car', BrandName: 'Tata', DisplayOrder: '1'}, {VehicleBrandId: 2004, VEHICLETYPEID: 2003, VEHICLETYPENAME: 'Bike', BrandName: 'TVS', DisplayOrder: '4'}]}})),
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
  await press(tree, 'Select Vehicle Type');
  await press(tree, 'Vehicle Type: Car');
  await press(tree, 'Select Vehicle Category');
  await press(tree, 'Vehicle Category: SUV');
  await press(tree, 'Select Brand');
  await press(tree, 'Brand: Tata');
  await fill(tree, 'Listing title *', 'Tata Nexon');
  await fill(tree, 'Expected price (₹) *', '650000');
  await fill(tree, 'Manufacturing year *', '2024');
  await fill(tree, 'Model', 'Nexon');
  await fill(tree, 'Variant', 'XZ');
  await fill(tree, 'Registration year', '2023');
  await fill(tree, 'Kilometres driven', '35000');
  await fill(tree, 'Owner mobile number', '9876543210');
  await fill(tree, 'Address line 1', 'Main Road');
  await fill(tree, 'Fuel type *', 'Petrol');
  await act(async () => tree.root.findByType(Switch).props.onValueChange(true));
  for (const label of ['Select Country', 'Country: India', 'Select State', 'State: Maharashtra', 'Select City', 'City: Nagpur', 'Select Area', 'Area: Ayodhya Nagar']) {await press(tree, label);}
  await press(tree, 'Save Listing');
  expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  await fill(tree, 'Registration year', '2025');
  pick.mockResolvedValue([{uri: 'content://vehicle', name: 'vehicle.jpg', type: 'image/jpeg', hasRequestedType: true, size: 1000}]);
  keepLocalCopy.mockResolvedValue([{status: 'success', localUri: 'file:///saved-vehicle.jpg'}]);
  const platform = jest.replaceProperty(Platform, 'OS', 'android');
  try {
    await press(tree, 'Choose vehicle photos');
    expect(pick).toHaveBeenCalledWith({type: 'image/*', allowMultiSelection: true});
  } finally {
    platform.restore();
  }
  await press(tree, 'Save Listing');
  expect(tree.root.findByType(FlatList).props.data[0]).toMatchObject({
    title: 'Tata Nexon', model: 'Nexon', variant: 'XZ', registrationYear: '2025', kilometres: '35000',
    ownerMobile: '9876543210', addressLine1: 'Main Road', pincode: '440024', negotiable: true,
    photos: ['file:///saved-vehicle.jpg'],
  });
  await press(tree, 'Edit');
  expect(tree.root.findAllByType(TextInput).find(node => node.props.accessibilityLabel === 'Model').props.value).toBe('Nexon');
  await press(tree, 'Remove photo 1');
  await fill(tree, 'Expected price (₹) *', '620000');
  await press(tree, 'Save Changes');
  expect(tree.root.findByType(FlatList).props.data[0].photos).toEqual([]);
  await press(tree, 'Mark as Sold');
  await act(async () => alert.mock.calls.at(-1)[2][1].onPress());
  await press(tree, 'Active (0)');
  expect(tree.root.findByType(FlatList).props.data).toHaveLength(0);
  const saved = AsyncStorage.setItem.mock.calls.at(-1)[1];
  expect(JSON.parse(saved)[0]).toMatchObject({price: 620000, status: 'Sold', BrandName: 'Tata', VehicleBrandId: 2003, VEHICLETYPEID: 2000, VEHICLETYPENAME: 'Car', VehicleCategoryId: 2008, CATEGORYCODE: 'VC2005', CATEGORYNAME: 'SUV', ParentCategoryID: 0, CategoryLevel: 1, location: 'Ayodhya Nagar, Nagpur, Maharashtra', locationDetails: {countryId: 1, stateId: 1, cityId: 1, areaId: 10, pincode: '440024'}});
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

test('restores a selected brand and clears its IDs when vehicle category changes', async () => {
  AsyncStorage.getItem.mockResolvedValue(JSON.stringify([{id: '1', title: 'Vehicle', category: '4 Wheeler', price: 650000, year: '2024', fuel: 'Petrol', location: 'Nagpur', status: 'Active', BrandName: 'Tata', VehicleBrandId: 2003, VEHICLETYPEID: 2000, VEHICLETYPENAME: 'Car', VehicleCategoryId: 2008, CATEGORYNAME: 'SUV', CATEGORYCODE: 'VC2005', ParentCategoryID: 0, CategoryLevel: 1}]));
  let tree;
  await act(async () => {tree = create(<MySalesScreen />);});
  await press(tree, 'Edit');
  expect(tree.root.findAllByType(Text).some(node => node.props.children === 'Tata')).toBe(true);
  await press(tree, 'Select Vehicle Type');
  await press(tree, 'Vehicle Type: Car');
  expect(tree.root.findAllByType(Text).some(node => node.props.children === 'Tata')).toBe(true);
  expect(tree.root.findAllByType(Text).some(node => node.props.children === 'SUV')).toBe(true);
  await press(tree, '2 Wheeler');
  expect(tree.root.findAllByType(Text).some(node => node.props.children === 'Tata')).toBe(false);
  await press(tree, 'Save Changes');
  expect(JSON.parse(AsyncStorage.setItem.mock.calls.at(-1)[1])[0]).toMatchObject({category: '2 Wheeler', BrandName: '', VehicleBrandId: null, VEHICLETYPEID: null, VehicleCategoryId: null, CATEGORYNAME: '', CATEGORYCODE: '', ParentCategoryID: null, CategoryLevel: null});
  await press(tree, 'Edit');
  await press(tree, 'Select Vehicle Type');
  await press(tree, 'Vehicle Type: Bike');
  await press(tree, 'Select Brand');
  await press(tree, 'Brand: TVS');
  await press(tree, 'Save Changes');
  expect(JSON.parse(AsyncStorage.setItem.mock.calls.at(-1)[1])[0]).toMatchObject({BrandName: 'TVS', VehicleBrandId: 2004, VEHICLETYPEID: 2003, VEHICLETYPENAME: 'Bike'});
  await act(async () => tree.unmount());
});

test('changing type within the same category clears the previous brand and saves exact type fields', async () => {
  AsyncStorage.getItem.mockResolvedValue(JSON.stringify([{id: '1', title: 'Vehicle', category: '2 Wheeler', price: 65000, year: '2024', fuel: 'Petrol', location: 'Nagpur', status: 'Active', BrandName: 'TVS', VehicleBrandId: 2004, VEHICLETYPEID: 2003, VEHICLETYPENAME: 'Bike'}]));
  let tree;
  await act(async () => {tree = create(<MySalesScreen />);});
  await press(tree, 'Edit');
  await press(tree, 'Select Vehicle Type');
  await press(tree, 'Vehicle Type: Scooter');
  expect(tree.root.findAllByType(Text).some(node => node.props.children === 'TVS')).toBe(false);
  await press(tree, 'Save Changes');
  expect(JSON.parse(AsyncStorage.setItem.mock.calls.at(-1)[1])[0]).toMatchObject({VEHICLETYPEID: 2006, VEHICLETYPECODE: 'VT2004', VEHICLETYPENAME: 'Scooter', BrandName: '', VehicleBrandId: null});
  await act(async () => tree.unmount());
});
