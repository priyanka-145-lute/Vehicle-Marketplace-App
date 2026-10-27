import {useThemeStyles} from '../theme/colors';
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import WishlistHeart from './WishlistHeart';
import NetworkVehicleImage from './NetworkVehicleImage';

const {width} = Dimensions.get('window');

const getFallbackImage = type => type === '2wheeler'
  ? 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=900&auto=format&fit=crop'
  : 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=900&auto=format&fit=crop';

const TopVehicleCard = ({item, onPress}) => {
  const {colors, styles} = useThemeStyles(createStyles);

  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.topCard} onPress={onPress}>

      {/* NEW Badge */}
      <View style={styles.newTag}>
        <Text style={styles.newText}>NEW</Text>
      </View>

      {/* Heart */}
      <WishlistHeart item={item} style={styles.topHeart} color={colors.text} />

      {/* Image */}
      <NetworkVehicleImage
        uri={item.image}
        fallbackUri={getFallbackImage(item.type)}
        style={styles.topCarImage}
      />

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

const createStyles = colors => StyleSheet.create({
  topCard: {
    width: width * 0.44,
    backgroundColor: colors.surface,
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
    height: 115,
    resizeMode: 'cover',
    borderRadius: 12,
    backgroundColor: colors.surfaceMuted,
    marginTop: 8,
  },
  topCarTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 10,
    color: colors.text,
  },
  topDetails: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  topPrice: {
    color: 'red',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 7,
  },
});
