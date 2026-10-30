/* eslint-env jest */
import React from 'react';
import {act, create} from 'react-test-renderer';
import {FlatList} from 'react-native';
import PartsScreen from '../src/screens/PartsScreen';
import ServicesScreen from '../src/screens/ServicesScreen';
jest.mock('@react-native-async-storage/async-storage', () => ({getItem: jest.fn(), setItem: jest.fn()}));
jest.mock('react-native-safe-area-context', () => ({useSafeAreaInsets: () => ({top: 24, bottom: 20})}));
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('../src/components/SearchBar', () => 'SearchBar');

test.each(['2wheeler-parts', '4wheeler-parts', 'services'])('%s retains the two-column list and supports search and clearing', async type => {
  jest.useFakeTimers();
  let tree;
  await act(async () => {tree = create(type === 'services' ? <ServicesScreen navigation={{}} /> : <PartsScreen navigation={{}} route={{params: {partType: type}}} />);});
  const list = () => tree.root.findAllByType(FlatList).find(node => node.props.numColumns === 2);
  const count = list().props.data.length;
  expect(count).toBeGreaterThan(0);
  await act(async () => tree.root.findByType('SearchBar').props.onChangeText('no-match-vehicle-xyz'));
  expect(list().props.data).toHaveLength(0);
  expect(list().props.ListEmptyComponent).toBeTruthy();
  await act(async () => tree.root.findByType('SearchBar').props.onChangeText(''));
  expect(list().props.data).toHaveLength(count);
  await act(async () => tree.unmount());
  jest.useRealTimers();
});
