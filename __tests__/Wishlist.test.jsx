import React from 'react';
import {act, create} from 'react-test-renderer';
import {TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {WishlistProvider, useWishlist} from '../src/context/WishlistContext';
import WishlistHeart from '../src/components/WishlistHeart';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

let wishlist;
const Probe = () => {wishlist = useWishlist(); return null;};
const bike = {id: '1', title: 'Yamaha R15 V4', type: 'Motorcycle', price: 185000};

beforeEach(() => {jest.clearAllMocks(); AsyncStorage.getItem.mockResolvedValue(null);});

test('heart fills, saves, synchronizes featured cards, and clears after removal', async () => {
  let tree;
  await act(async () => {
    tree = create(<WishlistProvider><Probe /><WishlistHeart item={bike} vehicleType="2wheeler" /></WishlistProvider>);
  });
  const stopPropagation = jest.fn();
  await act(async () => tree.root.findByType(TouchableOpacity).props.onPress({stopPropagation}));
  expect(stopPropagation).toHaveBeenCalled();
  expect(tree.root.findByType('Icon').props.name).toBe('heart');
  expect(wishlist.wishlistData).toHaveLength(1);
  expect(wishlist.isWishlisted({id: '5', type: '2wheeler'})).toBe(true);
  expect(JSON.parse(AsyncStorage.setItem.mock.calls.at(-1)[1])[0].title).toBe(bike.title);
  await act(async () => wishlist.removeFromWishlist(wishlist.wishlistData[0].wishlistKey));
  expect(tree.root.findByType('Icon').props.name).toBe('heart-outline');
  expect(wishlist.wishlistData).toEqual([]);
  await act(async () => tree.unmount());
});

test('keeps identical IDs in different categories separate and restores saved items', async () => {
  let tree;
  await act(async () => {tree = create(<WishlistProvider><Probe /></WishlistProvider>);});
  await act(async () => {
    wishlist.toggleWishlist(bike, '2wheeler');
    wishlist.toggleWishlist({id: '1', title: 'Swift'}, '4wheeler');
    wishlist.toggleWishlist({id: '1', title: 'Starbus'}, 'other');
  });
  expect(wishlist.wishlistData).toHaveLength(3);
  await act(async () => wishlist.toggleWishlist(bike, '2wheeler'));
  expect(wishlist.wishlistData).toHaveLength(2);
  const saved = AsyncStorage.setItem.mock.calls.at(-1)[1];
  await act(async () => tree.unmount());
  AsyncStorage.getItem.mockResolvedValue(saved);
  await act(async () => {tree = create(<WishlistProvider><Probe /></WishlistProvider>);});
  expect(wishlist.wishlistData.map(item => item.vehicleType)).toEqual(['4wheeler', 'other']);
  await act(async () => tree.unmount());
});

test('preserves taps made while saved wishlist is loading', async () => {
  let finishLoading;
  AsyncStorage.getItem.mockReturnValue(new Promise(resolve => {finishLoading = resolve;}));
  let tree;
  await act(async () => {tree = create(<WishlistProvider><Probe /></WishlistProvider>);});
  await act(async () => wishlist.toggleWishlist(bike, '2wheeler'));
  await act(async () => finishLoading(JSON.stringify([{id: '1', vehicleType: 'other', wishlistKey: 'other:1'}])));
  expect(wishlist.wishlistData).toHaveLength(2);
  await act(async () => tree.unmount());
});
