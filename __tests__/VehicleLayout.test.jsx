/* eslint-env jest */
import React from 'react';
import {act, create} from 'react-test-renderer';
import {FlatList, ScrollView} from 'react-native';
import VehicleScreen from '../src/screens/VehicleScreen';
import {useRoute} from '@react-navigation/native';
jest.mock('@react-native-async-storage/async-storage', () => ({getItem: jest.fn(), setItem: jest.fn()}));

jest.mock('@react-navigation/native', () => ({useRoute: jest.fn(), useNavigation: () => ({navigate: jest.fn()})}));
jest.mock('react-native-safe-area-context', () => ({SafeAreaView: require('react-native').View}));
jest.mock('../src/components/Header', () => 'Header');
jest.mock('../src/components/SearchBar', () => 'SearchBar');
jest.mock('../src/components/SectionHeader', () => 'SectionHeader');
jest.mock('../src/components/CategoryTab', () => 'CategoryTab');
jest.mock('../src/components/VehicleCard', () => 'VehicleCard');
jest.mock('../src/components/TopVehicleCard', () => 'TopVehicleCard');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

test.each([
  ['2wheeler', 8, 'Scooter', 'Ather 450X'],
  ['4wheeler', 9, 'MUV', 'Toyota Innova Crysta'],
  ['other', 10, 'Forklift', 'Godrej UNO 20'],
])('%s shows its expanded grid and fits three rows in the measured viewport', async (vehicleType, count, category, title) => {
  jest.useFakeTimers();
  useRoute.mockReturnValue({params: {vehicleType}});
  let tree;
  await act(async () => {tree = create(<VehicleScreen />);});
  const measure = async (node, height) => act(async () => node.props.onLayout({nativeEvent: {layout: {height}}}));
  await measure(tree.root.findAllByType(ScrollView).find(node => node.props.onLayout), 700);
  const controls = [tree.root.findAllByProps({testID: 'vehicle-header'})[0], tree.root.findAllByProps({testID: 'vehicle-controls'})[0]];
  await measure(controls[0], 180);
  await measure(controls[1], 100);
  const lists = tree.root.findAllByType(FlatList);
  const featured = lists.find(node => node.props.horizontal);
  const grid = lists.find(node => node.props.numColumns === 2);
  expect(featured.props.data).toHaveLength(2);
  expect(grid.props.data).toHaveLength(count);
  expect(new Set(grid.props.data.map(grid.props.keyExtractor)).size).toBe(count);
  const card = grid.props.renderItem({item: grid.props.data[0]});
  expect(card.props.cardHeight * 3 + 16 + 180 + 100).toBeLessThanOrEqual(700);
  expect(featured.props.renderItem({item: featured.props.data[0]}).props.cardHeight).toBe(card.props.cardHeight);
  await measure(tree.root.findAllByType(ScrollView).find(node => node.props.onLayout), 850);
  expect(tree.root.findAllByType(FlatList).find(node => node.props.numColumns === 2).props.renderItem({item: grid.props.data[0]}).props.cardHeight).toBeGreaterThan(card.props.cardHeight);
  const tab = tree.root.findAllByType('CategoryTab').find(node => node.props.label === category);
  await act(async () => tab.props.onPress());
  expect(grid.props.data.every(item => item.category === category)).toBe(true);
  expect(grid.props.data.some(item => item.title === title)).toBe(true);
  await act(async () => tree.unmount());
  jest.useRealTimers();
});
