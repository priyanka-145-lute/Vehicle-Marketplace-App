/* eslint-env jest */
import React from 'react';
import {act, create} from 'react-test-renderer';
import {ActivityIndicator, Text, TouchableOpacity} from 'react-native';
import VehicleTypeDropdown from '../src/components/VehicleTypeDropdown';
import OtherVehicleFilterDrawer, {OTHER_FILTER_DEFAULTS} from '../src/components/OtherVehicleFilterDrawer';
import {useGetBrandsQuery, useGetVehicleTypesQuery} from '../src/redux/api';

jest.mock('@react-native-async-storage/async-storage', () => ({getItem: jest.fn()}));
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('../src/redux/api', () => ({useGetVehicleTypesQuery: jest.fn(), useGetBrandsQuery: jest.fn()}));
const types = [
  {VEHICLETYPEID: 2000, VEHICLETYPECODE: 'VT2001', VEHICLETYPENAME: 'Car'},
  {VEHICLETYPEID: 2003, VEHICLETYPECODE: 'VT2003', VEHICLETYPENAME: 'Bike'},
  {VEHICLETYPEID: 2006, VEHICLETYPECODE: 'VT2004', VEHICLETYPENAME: 'Scooter'},
  {VEHICLETYPEID: 2011, VEHICLETYPECODE: 'VT2011', VEHICLETYPENAME: 'Truck'},
  {VEHICLETYPEID: 2012, VEHICLETYPECODE: 'VT2012', VEHICLETYPENAME: 'Bus'},
];
beforeEach(() => {
  jest.clearAllMocks();
  useGetVehicleTypesQuery.mockReturnValue({currentData: {success: true, data: types}});
  useGetBrandsQuery.mockReturnValue({currentData: {success: true, data: [{VehicleBrandId: 99, VEHICLETYPEID: 2011, VEHICLETYPENAME: 'Truck', BrandName: 'Truck Brand', DisplayOrder: '1'}]}});
});
const button = (tree, label) => tree.root.findAllByType(TouchableOpacity).find(node => node.props.accessibilityLabel === label || node.findAllByType(Text).some(text => text.props.children === label));
const press = async (tree, label) => {await act(async () => button(tree, label).props.onPress());};
test.each([
  ['4 Wheeler', ['Car']], ['2 Wheeler', ['Bike', 'Scooter']], ['Other', ['Truck', 'Bus']],
])('%s shows only matching types and returns the unchanged backend record', async (category, names) => {
  const change = jest.fn();
  let tree;
  await act(async () => {tree = create(<VehicleTypeDropdown category={category} open onChange={change} onOpenChange={jest.fn()} />);});
  expect(tree.root.findAllByType(TouchableOpacity).filter(node => node.props.accessibilityLabel?.startsWith('Vehicle Type: ')).map(node => node.props.accessibilityLabel)).toEqual(names.map(name => `Vehicle Type: ${name}`));
  await press(tree, `Vehicle Type: ${names[0]}`);
  expect(change).toHaveBeenCalledWith(types.find(type => type.VEHICLETYPENAME === names[0]));
  await act(async () => tree.unmount());
});
test('Other filter links brand IDs, clears dependent selections and restores defaults', async () => {
  const apply = jest.fn();
  let tree;
  await act(async () => {tree = create(<OtherVehicleFilterDrawer visible filters={OTHER_FILTER_DEFAULTS} onApply={apply} onClose={jest.fn()} />);});
  expect(button(tree, 'Select Brand').props.disabled).toBe(true);
  await press(tree, 'Select Vehicle Type');
  await press(tree, 'Vehicle Type: Truck');
  await press(tree, 'Select Brand');
  await press(tree, 'Brand: Truck Brand');
  await press(tree, 'Apply Filters');
  expect(apply).toHaveBeenLastCalledWith(expect.objectContaining({type: 'Truck', VEHICLETYPEID: 2011, VEHICLETYPECODE: 'VT2011', brand: 'Truck Brand', VehicleBrandId: 99}));
  await press(tree, 'Select Vehicle Type');
  await press(tree, 'Vehicle Type: Bus');
  await press(tree, 'Apply Filters');
  expect(apply).toHaveBeenLastCalledWith(expect.objectContaining({type: 'Bus', VEHICLETYPEID: 2012, brand: 'All Brands', VehicleBrandId: null, model: 'All Models'}));
  await press(tree, 'Clear All');
  await press(tree, 'Apply Filters');
  expect(apply).toHaveBeenLastCalledWith(OTHER_FILTER_DEFAULTS);
  await act(async () => tree.unmount());
});
test('handles skipped queries, loading, errors, retry and malformed/empty lists', async () => {
  let tree;
  await act(async () => {tree = create(<VehicleTypeDropdown enabled={false} onChange={jest.fn()} onOpenChange={jest.fn()} />);});
  expect(useGetVehicleTypesQuery).toHaveBeenLastCalledWith(undefined, {skip: true});
  useGetVehicleTypesQuery.mockReturnValue({isFetching: true});
  await act(async () => tree.update(<VehicleTypeDropdown open onChange={jest.fn()} onOpenChange={jest.fn()} />));
  expect(tree.root.findByType(ActivityIndicator).props.accessibilityLabel).toBe('Loading vehicle types');
  const refetch = jest.fn();
  useGetVehicleTypesQuery.mockReturnValue({currentData: {success: true, data: [null]}, refetch});
  await act(async () => tree.update(<VehicleTypeDropdown open onChange={jest.fn()} onOpenChange={jest.fn()} />));
  await press(tree, 'Retry vehicle types');
  expect(refetch).toHaveBeenCalledTimes(1);
  useGetVehicleTypesQuery.mockReturnValue({currentData: {success: true, data: []}});
  await act(async () => tree.update(<VehicleTypeDropdown open onChange={jest.fn()} onOpenChange={jest.fn()} />));
  expect(tree.root.findAllByType(Text).some(node => node.props.children === 'No vehicle types available.')).toBe(true);
  await act(async () => tree.unmount());
});
