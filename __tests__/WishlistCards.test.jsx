/* eslint-env jest */
import React from 'react';
import {act, create} from 'react-test-renderer';
import {FlatList} from 'react-native';
import WishlistScreen from '../src/screens/WishlistScreen';
import {useWishlist} from '../src/context/WishlistContext';
jest.mock('@react-native-async-storage/async-storage', () => ({getItem: jest.fn(), setItem: jest.fn()}));
jest.mock('../src/context/WishlistContext', () => ({useWishlist: jest.fn()}));
jest.mock('../src/components/VehicleCard', () => 'VehicleCard');
jest.mock('../src/components/TopVehicleCard', () => 'TopVehicleCard');
jest.mock('../src/components/WishlistHeart', () => 'WishlistHeart');
jest.mock('../src/components/NetworkVehicleImage', () => 'NetworkVehicleImage');
jest.mock('react-native-vector-icons/Octicons', () => 'Icon');

test.each([['grid', 'VehicleCard'], ['featured', 'TopVehicleCard']])('wishlist reuses the original %s card and its height', async (variant, component) => {
  const item = {id: '5', type: '2wheeler', vehicleType: '2wheeler', title: 'Bike', wishlistKey: '2wheeler:1', wishlistCardVariant: variant, wishlistCardHeight: 145};
  useWishlist.mockReturnValue({wishlistData: [item]});
  const navigate = jest.fn();
  let tree;
  await act(async () => {tree = create(<WishlistScreen navigation={{navigate}} />);});
  const card = tree.root.findByType(FlatList).props.renderItem({item});
  expect(card.type).toBe(component);
  expect(card.props.item).toBe(item);
  expect(card.props.cardHeight).toBe(145);
  card.props.onPress();
  expect(navigate).toHaveBeenCalledWith('TwoWheelerDetail', {item, vehicleType: '2wheeler'});
  await act(async () => tree.unmount());
});
