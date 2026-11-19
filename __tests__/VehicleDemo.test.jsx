/* eslint-env jest */
import React from 'react';
import {act, create} from 'react-test-renderer';
import {FlatList, Text} from 'react-native';
import {CARS, OTHER_VEHICLES, TWO_WHEELERS} from '../src/data/vehicleCatalog';
import TwoWheelerDetailScreen from '../src/screens/TwoWheelerDetailScreen';

jest.mock('@react-native-async-storage/async-storage', () => ({getItem: jest.fn(), setItem: jest.fn()}));
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native-safe-area-context', () => ({SafeAreaView: require('react-native').View}));
jest.mock('../src/components/NetworkVehicleImage', () => 'VehicleImage');
jest.mock('../src/data/vehicleCatalog', () => {
  const {Image} = require('react-native');
  jest.spyOn(Image, 'resolveAssetSource').mockImplementation(source => ({uri: source.testUri}));
  return jest.requireActual('../src/data/vehicleCatalog');
});

test('every demo vehicle has its own image and listing details', () => {
  const vehicles = [...CARS, ...TWO_WHEELERS, ...OTHER_VEHICLES];
  expect(vehicles).toHaveLength(27);
  for (const key of ['imageKey', 'title', 'description', 'usage']) {
    expect(new Set(vehicles.map(item => item[key])).size).toBe(vehicles.length);
  }
  vehicles.forEach(item => {
    expect(item.image).toBeTruthy();
    expect(item.price).toBeGreaterThan(0);
    expect(item.specifications).toContainEqual(['Fuel', item.fuel]);
    expect(item.specifications).toContainEqual(['Transmission', item.transmission]);
    if (item.fuel === 'Electric') {
      expect(item.engine).toBe('Electric motor');
      expect(item.specifications.some(([label]) => label === 'Engine')).toBe(false);
    }
  });
});

test.each([
  TWO_WHEELERS.find(item => item.imageKey === 'ather'),
  CARS.find(item => item.imageKey === 'city'),
  OTHER_VEHICLES.find(item => item.imageKey === 'jcb'),
])('$title keeps its own photo, usage and specification details', async item => {
  let tree;
  await act(async () => {
    tree = create(<TwoWheelerDetailScreen navigation={{goBack: jest.fn(), push: jest.fn()}} route={{params: {item, vehicleType: item.vehicleType}}} />);
  });
  const gallery = tree.root.findByType(FlatList);
  expect(gallery.props.data).toEqual([item.image]);
  const text = tree.root.findAllByType(Text).map(node => node.props.children);
  for (const value of [item.title, item.usage, item.engine, item.description, item.sellerName]) {
    expect(text).toContain(value);
  }
  expect(text).not.toContain('Till Mar 2025');
  await act(async () => tree.unmount());
});
