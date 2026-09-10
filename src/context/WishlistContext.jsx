import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'vehicle-wishlist';

export const getWishlistKey = (item, vehicleType = item.vehicleType || item.type) => {
  // The featured catalog uses different IDs for the same vehicles.
  const featuredIds = vehicleType === '2wheeler'
    ? {'5': '1', '6': '2', '7': '3', '8': '4'}
    : {'4': 'creta', '4b': '4'};
  const id = item.type === vehicleType ? featuredIds[item.id] || item.id : item.id;
  return `${vehicleType}:${id}`;
};

const toggleItem = (items, item) => items.some(saved => saved.wishlistKey === item.wishlistKey)
  ? items.filter(saved => saved.wishlistKey !== item.wishlistKey)
  : [...items, item];

export const WishlistProvider = ({children}) => {
  const [wishlistData, setWishlistData] = useState([]);
  const [ready, setReady] = useState(false);
  const pending = useRef([]);
  const writes = useRef(Promise.resolve());

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then(value => {
        const saved = value ? JSON.parse(value) : [];
        if (!Array.isArray(saved)) {throw new Error('Invalid wishlist');}
        if (active) {
          setWishlistData(pending.current.reduce((items, update) => update(items), saved));
        }
      })
      .catch(() => {
        if (active) {Alert.alert('Wishlist', 'Could not load your saved wishlist.');}
      })
      .finally(() => {
        if (active) {pending.current = []; setReady(true);}
      });
    return () => {active = false;};
  }, []);

  useEffect(() => {
    if (!ready) {return;}
    writes.current = writes.current
      .then(() => AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistData)))
      .catch(() => Alert.alert('Wishlist', 'Could not save your wishlist on this device.'));
  }, [ready, wishlistData]);

  const updateWishlist = update => {
    if (!ready) {pending.current.push(update);}
    setWishlistData(update);
  };

  const toggleWishlist = (item, vehicleType = item.vehicleType || item.type) => {
    const saved = {...item, vehicleType, wishlistKey: getWishlistKey(item, vehicleType)};
    updateWishlist(items => toggleItem(items, saved));
  };
  const removeFromWishlist = key => updateWishlist(items => items.filter(item => item.wishlistKey !== key));
  const isWishlisted = (item, vehicleType) => wishlistData.some(saved => saved.wishlistKey === getWishlistKey(item, vehicleType));

  return <WishlistContext.Provider value={{wishlistData, toggleWishlist, removeFromWishlist, isWishlisted}}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => useContext(WishlistContext);
