import {useThemeStyles} from '../theme/colors';
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import WishlistHeart from './WishlistHeart';
import NetworkVehicleImage from './NetworkVehicleImage';

const getFallbackImage = type => type === '2wheeler'
  ? 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=900&auto=format&fit=crop'
  : 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=900&auto=format&fit=crop';

const VehicleCard = ({item, onPress, onBookmarkPress, cardHeight, inlineDetails}) => {
  const {colors, styles} = useThemeStyles(createStyles);

  return (
    <TouchableOpacity activeOpacity={0.85} style={[styles.card, cardHeight && {height: cardHeight, padding: 8, marginBottom: 8}]} onPress={onPress}>

      {/* Heart / Wishlist */}
      {!inlineDetails && <WishlistHeart item={{...item, wishlistCardVariant: 'grid', wishlistCardHeight: cardHeight}} style={styles.heartBtn} color={colors.text} />}

      {/* Vehicle Image */}
      <NetworkVehicleImage
        uri={item.image}
        fallbackUri={getFallbackImage(item.type)}
        style={[styles.carImage, cardHeight && {height: undefined, flex: 1, minHeight: 20}]}
      />

      {inlineDetails ? <>
        <View style={styles.titleRow}>
          <Text style={styles.inlineTitle} numberOfLines={1}>{item.title}</Text>
          <WishlistHeart item={{...item, wishlistCardVariant: 'grid', wishlistCardHeight: cardHeight}} style={styles.inlineHeart} color={colors.text} />
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.inlineSpecs}>{item.fuel} • {item.transmission}</Text>
          <Text style={styles.priceBadge}>{item.price}</Text>
        </View>
      </> : <>
        {/* Title */}
        <Text style={[styles.carTitle, cardHeight && {marginTop: 4, fontSize: 13}]} numberOfLines={1}>
          {item.title}
        </Text>

        {/* Fuel & Transmission */}
        <Text style={[styles.carDetails, cardHeight && {marginTop: 2}]} numberOfLines={1}>
          {item.fuel} • {item.transmission}
        </Text>

        {/* Price */}
        <Text style={[styles.carPrice, cardHeight && {marginTop: 3, fontSize: 13}]} numberOfLines={1}>{item.price}</Text>
      </>}

      {/* Bookmark */}
      <TouchableOpacity style={[styles.bookmarkBtn, inlineDetails && styles.inlineBookmark]} onPress={onBookmarkPress}>
        <Icon name="bookmark-outline" size={17} color={colors.text} />
      </TouchableOpacity>

    </TouchableOpacity>
  );
};

export default VehicleCard;

const createStyles = colors => StyleSheet.create({
  titleRow: {flexDirection: 'row', alignItems: 'center', marginTop: 4},
  inlineTitle: {flex: 1, fontSize: 13, fontWeight: '700', color: colors.text},
  inlineHeart: {minWidth: 28, minHeight: 28, alignItems: 'center', justifyContent: 'center', marginLeft: 4},
  detailsRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4, marginTop: 2},
  inlineSpecs: {flex: 1, fontSize: 10, lineHeight: 14, color: colors.textMuted},
  priceBadge: {flexShrink: 1, fontSize: 11, fontWeight: '700', color: colors.text, backgroundColor: colors.accentSurface, paddingHorizontal: 6, paddingVertical: 5, borderRadius: 6},
  inlineBookmark: {top: 10, bottom: undefined, right: 10},
  card: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 10,
    marginBottom: 14,
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
    height: 115,
    resizeMode: 'cover',
    borderRadius: 12,
    backgroundColor: colors.surfaceMuted,
  },
  carTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginTop: 10,
  },
  carDetails: {
    color: colors.textMuted,
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
