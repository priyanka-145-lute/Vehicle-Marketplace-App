/* eslint-env jest */
import React from 'react';
import {act, create} from 'react-test-renderer';
import {ActivityIndicator, Text, TouchableOpacity} from 'react-native';
import VehicleCategoryDropdown from '../src/components/VehicleCategoryDropdown';
import FourWheelerFilterDrawer, {FOUR_WHEELER_FILTER_DEFAULTS} from '../src/components/FourWheelerFilterDrawer';
import {useGetBrandsQuery, useGetVehicleCategoriesQuery, useGetVehicleTypesQuery} from '../src/redux/api';

jest.mock('@react-native-async-storage/async-storage', () => ({getItem: jest.fn()}));
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('../src/redux/api', () => ({useGetVehicleCategoriesQuery: jest.fn(), useGetVehicleTypesQuery: jest.fn(), useGetBrandsQuery: jest.fn()}));
const suv = {VehicleCategoryId: 2008, VEHICLETYPEID: 5678, VEHICLETYPENAME: 'Car', CATEGORYCODE: 'VC2005', CATEGORYNAME: 'SUV', DESCRIPTION: 'SUV', ICONPATH: 'suv.jpg', ParentCategoryID: 0, CategoryLevel: 1};
const other = {...suv, VehicleCategoryId: 2010, VEHICLETYPEID: 99, CATEGORYNAME: 'Other type category'};
beforeEach(() => {
  jest.clearAllMocks();
  useGetVehicleCategoriesQuery.mockReturnValue({currentData: {success: true, data: [suv, other]}});
  useGetVehicleTypesQuery.mockReturnValue({currentData: {success: true, data: [{VEHICLETYPEID: 5678, VEHICLETYPENAME: 'Car'}]}});
  useGetBrandsQuery.mockReturnValue({currentData: {success: true, data: []}});
});
const button = (tree, label) => tree.root.findAllByType(TouchableOpacity).find(node => node.props.accessibilityLabel === label || node.findAllByType(Text).some(text => text.props.children === label));
const press = async (tree, label) => {await act(async () => button(tree, label).props.onPress());};
test('waits for a vehicle type, uses its ID and returns the exact selected category', async () => {
  const change = jest.fn();
  let tree;
  await act(async () => {tree = create(<VehicleCategoryDropdown onChange={change} onOpenChange={jest.fn()} />);});
  expect(useGetVehicleCategoriesQuery).toHaveBeenLastCalledWith(undefined, {skip: true});
  expect(button(tree, 'Select Vehicle Category').props.disabled).toBe(true);
  await act(async () => tree.update(<VehicleCategoryDropdown vehicleTypeId={5678} open onChange={change} onOpenChange={jest.fn()} />));
  expect(useGetVehicleCategoriesQuery).toHaveBeenLastCalledWith(5678, {skip: false});
  expect(button(tree, 'Vehicle Category: Other type category')).toBeUndefined();
  await press(tree, 'Vehicle Category: SUV');
  expect(change).toHaveBeenCalledWith(suv);
  await press(tree, 'Clear vehicle category');
  expect(change).toHaveBeenLastCalledWith(null);
  await act(async () => tree.unmount());
});
test('Body Type resolves Car ID dynamically and applies/clears API category fields', async () => {
  const apply = jest.fn();
  let tree;
  await act(async () => {tree = create(<FourWheelerFilterDrawer visible filters={FOUR_WHEELER_FILTER_DEFAULTS} onClose={jest.fn()} onApply={apply} />);});
  expect(useGetVehicleCategoriesQuery).toHaveBeenLastCalledWith(5678, {skip: false});
  await press(tree, 'SUV');
  await press(tree, 'Apply Filters');
  expect(apply).toHaveBeenLastCalledWith(expect.objectContaining({bodyType: 'SUV', VehicleCategoryId: 2008, CATEGORYNAME: 'SUV', CATEGORYCODE: 'VC2005', ParentCategoryID: 0, CategoryLevel: 1}));
  await press(tree, 'Clear All');
  await press(tree, 'Apply Filters');
  expect(apply).toHaveBeenLastCalledWith(FOUR_WHEELER_FILTER_DEFAULTS);
  await act(async () => tree.unmount());
});
test('handles parent lookup failure, retry and missing car type without a hardcoded fallback', async () => {
  const refetch = jest.fn();
  useGetVehicleTypesQuery.mockReturnValue({isError: true, refetch});
  let tree;
  await act(async () => {tree = create(<FourWheelerFilterDrawer visible filters={FOUR_WHEELER_FILTER_DEFAULTS} onClose={jest.fn()} onApply={jest.fn()} />);});
  expect(button(tree, 'SUV')).toBeUndefined();
  await press(tree, 'Retry body type vehicle');
  expect(refetch).toHaveBeenCalledTimes(1);
  expect(useGetVehicleCategoriesQuery).toHaveBeenLastCalledWith(undefined, {skip: true});
  await act(async () => tree.unmount());
});
test('shows loading, retries failed responses and ignores stale results for a different type', async () => {
  useGetVehicleCategoriesQuery.mockReturnValue({isFetching: true, data: {success: true, data: [suv]}});
  let tree;
  await act(async () => {tree = create(<VehicleCategoryDropdown vehicleTypeId={99} open onChange={jest.fn()} onOpenChange={jest.fn()} />);});
  expect(tree.root.findByType(ActivityIndicator).props.accessibilityLabel).toBe('Loading vehicle categories');
  expect(button(tree, 'Vehicle Category: SUV')).toBeUndefined();
  const refetch = jest.fn();
  useGetVehicleCategoriesQuery.mockReturnValue({currentData: {success: false}, refetch});
  await act(async () => tree.update(<VehicleCategoryDropdown vehicleTypeId={99} open onChange={jest.fn()} onOpenChange={jest.fn()} />));
  await press(tree, 'Retry vehicle categories');
  expect(refetch).toHaveBeenCalledTimes(1);
  useGetVehicleCategoriesQuery.mockReturnValue({currentData: {success: true, data: []}});
  await act(async () => tree.update(<VehicleCategoryDropdown vehicleTypeId={99} open onChange={jest.fn()} onOpenChange={jest.fn()} />));
  expect(tree.root.findAllByType(Text).some(node => node.props.children === 'No vehicle categories available.')).toBe(true);
  await act(async () => tree.unmount());
});
