/* eslint-env jest */
import React from 'react';
import {act, create} from 'react-test-renderer';
import {FlatList, Image} from 'react-native';
import PartsScreen from '../src/screens/PartsScreen';
import ServicesScreen from '../src/screens/ServicesScreen';
import ServiceDetailsScreen from '../src/screens/ServiceDetailsScreen';
import {serviceImages} from '../src/data/partsServiceImages';
jest.mock('@react-native-async-storage/async-storage', () => ({getItem: jest.fn(), setItem: jest.fn()}));
jest.mock('react-native-safe-area-context', () => ({useSafeAreaInsets: () => ({top: 24, bottom: 20})}));
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('../src/components/SearchBar', () => 'SearchBar');

test.each([serviceImages.s2, 'https://example.com/workshop.jpg'])('service details keep the selected workshop image throughout its gallery', async image => {
  let tree;
  await act(async () => {tree = create(<ServiceDetailsScreen navigation={{}} route={{params: {item: {name: 'Sample Garage', image}}}} />);});
  const source = typeof image === 'string' ? {uri: image} : image;
  expect(tree.root.findAllByType(Image).map(node => node.props.source)).toEqual([source, source]);
  await act(async () => tree.unmount());
});

test.each(['2wheeler-parts', '4wheeler-parts', 'services'])('%s retains the two-column list and supports search and clearing', async type => {
  jest.useFakeTimers();
  let tree;
  await act(async () => {tree = create(type === 'services' ? <ServicesScreen navigation={{}} /> : <PartsScreen navigation={{}} route={{params: {partType: type}}} />);});
  const list = () => tree.root.findAllByType(FlatList).find(node => node.props.numColumns === 2);
  const count = list().props.data.length;
  expect(count).toBeGreaterThan(0);
  const images = list().props.data.map(item => JSON.stringify(item.image));
  expect(new Set(images).size).toBe(count);
  list().props.data.forEach(item => {
    const card = list().props.renderItem({item});
    const image = React.Children.toArray(card.props.children).find(child => child.type === Image);
    expect(image.props.source).toEqual(item.image);
  });
  const banner = tree.root.findAllByType(FlatList).find(node => node.props.horizontal);
  expect(new Set(banner.props.data.map(item => JSON.stringify(item.image))).size).toBe(banner.props.data.length);
  const bannerItem = banner.props.data[0];
  const bannerImage = React.Children.toArray(banner.props.renderItem({item: bannerItem}).props.children).find(child => child.type === Image);
  expect(bannerImage.props.source).toEqual(bannerItem.image);
  await act(async () => tree.root.findByType('SearchBar').props.onChangeText('no-match-vehicle-xyz'));
  expect(list().props.data).toHaveLength(0);
  expect(list().props.ListEmptyComponent).toBeTruthy();
  await act(async () => tree.root.findByType('SearchBar').props.onChangeText(''));
  expect(list().props.data).toHaveLength(count);
  await act(async () => tree.unmount());
  jest.useRealTimers();
});
