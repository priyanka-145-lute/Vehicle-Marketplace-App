import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('window');

const TopVehicleCard = ({item, onPress, onHeartPress}) => {
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.topCard} onPress={onPress}>

      {/* NEW Badge */}
      <View style={styles.newTag}>
        <Text style={styles.newText}>NEW</Text>
      </View>

      {/* Heart */}
      <TouchableOpacity style={styles.topHeart} onPress={onHeartPress}>
        <Icon name="heart-outline" size={18} color="#555" />
      </TouchableOpacity>

      {/* Image */}
      <Image source={{uri: item.image}} style={styles.topCarImage} />

      {/* Title */}
      <Text style={styles.topCarTitle} numberOfLines={1}>
        {item.title}
      </Text>

      {/* Details */}
      <Text style={styles.topDetails}>
        {item.fuel} • {item.transmission}
      </Text>

      {/* Price */}
      <Text style={styles.topPrice}>{item.price}</Text>

    </TouchableOpacity>
  );
};

export default TopVehicleCard;

const styles = StyleSheet.create({
  topCard: {
    width: width * 0.44,
    backgroundColor: '#fff',
    marginLeft: 16,
    borderRadius: 18,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  newTag: {
    backgroundColor: 'red',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  newText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  topHeart: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  topCarImage: {
    width: '100%',
    height: 110,
    resizeMode: 'contain',
    marginTop: 8,
  },
  topCarTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 10,
    color: '#111',
  },
  topDetails: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  topPrice: {
    color: 'red',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 7,
  },
});