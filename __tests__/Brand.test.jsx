/* eslint-env jest */
import React from 'react';
import {act, create} from 'react-test-renderer';
import {Text, TouchableOpacity} from 'react-native';
import BrandDropdown from '../src/components/BrandDropdown';
import TwoWheelerFilterDrawer, {TWO_WHEELER_FILTER_DEFAULTS} from '../src/components/TwoWheelerFilterDrawer';
import FourWheelerFilterDrawer, {FOUR_WHEELER_FILTER_DEFAULTS} from '../src/components/FourWheelerFilterDrawer';
import {useGetBrandsQuery} from '../src/redux/api';

jest.mock('@react-native-async-storage/async-storage', () => ({getItem: jest.fn()}));
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('../src/redux/api', () => ({
  useGetBrandsQuery: jest.fn(),
  useGetVehicleTypesQuery: jest.fn(() => ({currentData: {success: true, data: [{VEHICLETYPEID: 2000, VEHICLETYPENAME: 'Car'}]}})),
  useGetVehicleCategoriesQuery: jest.fn(() => ({currentData: {success: true, data: []}})),
}));
const tata = {VehicleBrandId: 2003, VEHICLETYPEID: 2000, VEHICLETYPENAME: 'Car', BrandName: 'Tata', DisplayOrder: '1', LogoPath: 'tata.png'};
const mahindra = {...tata, VehicleBrandId: 2005, BrandName: 'Mahindra', DisplayOrder: '2'};
const tvs = {...tata, VehicleBrandId: 2004, VEHICLETYPEID: 2003, VEHICLETYPENAME: 'Bike', BrandName: 'TVS', DisplayOrder: '4'};
beforeEach(() => {
  jest.clearAllMocks();
  useGetBrandsQuery.mockReturnValue({currentData: {success: true, data: [mahindra, tvs, tata]}});
});
const button = (tree, label) => tree.root.findAllByType(TouchableOpacity).find(node => node.props.accessibilityLabel === label || node.findAllByType(Text).some(text => text.props.children === label));
const press = async (tree, label) => {await act(async () => button(tree, label).props.onPress());};

test('uses vehicle type and numeric DisplayOrder without modifying cached backend records', async () => {
  const change = jest.fn();
  let tree;
  await act(async () => {tree = create(<BrandDropdown vehicleType="Car" open onOpenChange={jest.fn()} onChange={change} />);});
  const options = tree.root.findAllByType(TouchableOpacity).filter(node => node.props.accessibilityLabel?.startsWith('Brand: '));
  expect(options.map(node => node.props.accessibilityLabel)).toEqual(['Brand: Tata', 'Brand: Mahindra']);
  await press(tree, 'Brand: Tata');
  expect(change).toHaveBeenCalledWith(tata);
  expect(useGetBrandsQuery.mock.results[0].value.currentData.data).toEqual([mahindra, tvs, tata]);
  await act(async () => tree.unmount());
});
test('uses the selected VEHICLETYPEID rather than matching a name', async () => {
  useGetBrandsQuery.mockReturnValue({currentData: {success: true, data: [tata, {...tata, VehicleBrandId: 999, VEHICLETYPEID: 999}]}});
  let tree;
  await act(async () => {tree = create(<BrandDropdown vehicleTypeId={2000} vehicleType="Different name" open onOpenChange={jest.fn()} onChange={jest.fn()} />);});
  expect(tree.root.findAllByType(TouchableOpacity).filter(node => node.props.accessibilityLabel === 'Brand: Tata')).toHaveLength(1);
  await act(async () => tree.unmount());
});
test.each([
  [TwoWheelerFilterDrawer, TWO_WHEELER_FILTER_DEFAULTS, 'TVS', tvs],
  [FourWheelerFilterDrawer, FOUR_WHEELER_FILTER_DEFAULTS, 'Tata', tata],
])('filter applies API brand IDs and name, resets the model and clears to defaults', async (Drawer, defaults, name, brand) => {
  const apply = jest.fn();
  let tree;
  await act(async () => {tree = create(<Drawer visible filters={{...defaults, model: 'Previously selected model'}} onApply={apply} onClose={jest.fn()} />);});
  await press(tree, 'Select Brand');
  expect(button(tree, name === 'TVS' ? 'Brand: Tata' : 'Brand: TVS')).toBeUndefined();
  await press(tree, `Brand: ${name}`);
  await press(tree, 'Apply Filters');
  expect(apply).toHaveBeenLastCalledWith(expect.objectContaining({brand: brand.BrandName, VehicleBrandId: brand.VehicleBrandId, VEHICLETYPEID: brand.VEHICLETYPEID, model: 'All Models'}));
  await press(tree, 'Clear All');
  await press(tree, 'Apply Filters');
  expect(apply).toHaveBeenLastCalledWith(defaults);
  await act(async () => tree.unmount());
});
test('skips queries while hidden and offers retry for API errors', async () => {
  const refetch = jest.fn();
  useGetBrandsQuery.mockReturnValue({isError: true, refetch});
  let tree;
  await act(async () => {tree = create(<BrandDropdown vehicleType="Bike" enabled={false} onChange={jest.fn()} onOpenChange={jest.fn()} />);});
  expect(useGetBrandsQuery).toHaveBeenLastCalledWith(undefined, {skip: true});
  await act(async () => tree.update(<BrandDropdown vehicleType="Bike" enabled onChange={jest.fn()} onOpenChange={jest.fn()} />));
  await press(tree, 'Retry brands');
  expect(refetch).toHaveBeenCalledTimes(1);
  await act(async () => tree.unmount());
});
test('handles empty, business failure, saving and clearing selection', async () => {
  useGetBrandsQuery.mockReturnValue({currentData: {success: true, data: []}});
  const change = jest.fn();
  let tree;
  await act(async () => {tree = create(<BrandDropdown vehicleType="Other" value={tata} open onChange={change} onOpenChange={jest.fn()} />);});
  expect(tree.root.findAllByType(Text).some(node => node.props.children === 'No brands available.')).toBe(true);
  await press(tree, 'Clear brand');
  expect(change).toHaveBeenCalledWith(null);
  useGetBrandsQuery.mockReturnValue({currentData: {success: false}, refetch: jest.fn()});
  await act(async () => tree.update(<BrandDropdown vehicleType="Car" disabled onChange={change} onOpenChange={jest.fn()} />));
  expect(button(tree, 'Select Brand').props.disabled).toBe(true);
  expect(button(tree, 'Retry brands').props.disabled).toBe(true);
  await act(async () => tree.unmount());
});
