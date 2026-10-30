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

test.each(['2wheeler', '4wheeler', 'other'])('%s fits a featured row and two grid rows in the measured viewport', async vehicleType => {
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
  expect(grid.props.data.length).toBeGreaterThanOrEqual(4);
  const card = grid.props.renderItem({item: grid.props.data[0]});
  expect(card.props.cardHeight * 3 + 16 + 180 + 100).toBeLessThanOrEqual(700);
  expect(featured.props.renderItem({item: featured.props.data[0]}).props.cardHeight).toBe(card.props.cardHeight);
  await measure(tree.root.findAllByType(ScrollView).find(node => node.props.onLayout), 850);
  expect(tree.root.findAllByType(FlatList).find(node => node.props.numColumns === 2).props.renderItem({item: grid.props.data[0]}).props.cardHeight).toBeGreaterThan(card.props.cardHeight);
  await act(async () => tree.unmount());
  jest.useRealTimers();
});
