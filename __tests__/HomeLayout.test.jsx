/* eslint-env jest */
import React from 'react';
import {act, create} from 'react-test-renderer';
import {FlatList, ScrollView} from 'react-native';
import HomeScreen from '../src/screens/HomeScreen';
jest.mock('@react-native-async-storage/async-storage', () => ({getItem: jest.fn(), setItem: jest.fn()}));
jest.mock('react-native-safe-area-context', () => ({SafeAreaView: require('react-native').View}));
jest.mock('../src/screens/AccountScreens', () => ({AccountLogoutContext: require('react').createContext(null)}));
jest.mock('../src/components/Header', () => 'Header');
jest.mock('../src/components/SearchBar', () => 'SearchBar');
jest.mock('../src/components/BannerSlider', () => 'Banner');
jest.mock('../src/components/CategoryCard', () => 'Category');

test('Home uses the original scrollable category layout', async () => {
  let tree;
  await act(async () => {tree = create(<HomeScreen navigation={{navigate: jest.fn()}} />);});
  expect(tree.root.findByType(ScrollView).props.onLayout).toBeUndefined();
  const list = tree.root.findByType(FlatList);
  expect(list.props.data).toHaveLength(6);
  expect(list.props.data.some(item => item.type === 'other')).toBe(true);
  expect(list.props.data.some(item => item.type === 'services')).toBe(true);
  const card = list.props.renderItem({item: list.props.data[0]});
  expect(list.props.data.map(item => item.title)).toEqual(['2 Wheeler', '4 Wheeler', 'Other Vehicles', '2 Wheeler Parts', '4 Wheeler Parts', 'Services']);
  expect(card.props.compact).toBeUndefined();
  expect(card.props.cardHeight).toBeUndefined();
  expect(tree.root.findByType('Banner').props.height).toBeUndefined();
  await act(async () => tree.unmount());
});
