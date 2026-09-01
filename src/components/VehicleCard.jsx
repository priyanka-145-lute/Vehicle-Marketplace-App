import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('window');

const VehicleCard = ({item, onPress, onHeartPress, onBookmarkPress}) => {
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.card} onPress={onPress}>

      {/* Heart / Wishlist */}
      <TouchableOpacity style={styles.heartBtn} onPress={onHeartPress}>
        <Icon name="heart-outline" size={18} color="#444" />
      </TouchableOpacity>

      {/* Vehicle Image */}
      <Image source={{uri: item.image}} style={styles.carImage} />

      {/* Title */}
      <Text style={styles.carTitle} numberOfLines={1}>
        {item.title}
      </Text>

      {/* Fuel & Transmission */}
      <Text style={styles.carDetails}>
        {item.fuel} • {item.transmission}
      </Text>

      {/* Price */}
      <Text style={styles.carPrice}>{item.price}</Text>

      {/* Bookmark */}
      <TouchableOpacity style={styles.bookmarkBtn} onPress={onBookmarkPress}>
        <Icon name="bookmark-outline" size={17} color="#444" />
      </TouchableOpacity>

    </TouchableOpacity>
  );
};

export default VehicleCard;

const styles = StyleSheet.create({
  card: {
    width: width * 0.44,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 10,
    marginBottom: 16,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  heartBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
  },
  carImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
  },
  carTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    marginTop: 10,
  },
  carDetails: {
    color: '#777',
    fontSize: 12,
    marginTop: 5,
  },
  carPrice: {
    color: 'red',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 6,
  },
  bookmarkBtn: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
});