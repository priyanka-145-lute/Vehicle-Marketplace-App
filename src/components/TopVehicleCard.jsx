import {useThemeStyles} from '../theme/colors';
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import WishlistHeart from './WishlistHeart';
import NetworkVehicleImage from './NetworkVehicleImage';

const {width} = Dimensions.get('window');

const TopVehicleCard = ({item, onPress, cardHeight, style, inlineDetails}) => {
  const {colors, styles} = useThemeStyles(createStyles);

  return (
    <TouchableOpacity activeOpacity={0.85} style={[styles.topCard, cardHeight && {height: cardHeight, padding: 8}, style]} onPress={onPress}>

      {/* NEW Badge */}
      <View style={[styles.newTag, cardHeight && {position: 'absolute', left: 8, top: 8, zIndex: 1}]}>
        <Text style={styles.newText}>{item.isDemo ? 'DEMO' : 'NEW'}</Text>
      </View>

      {/* Heart */}
      {!inlineDetails && <WishlistHeart item={{...item, wishlistCardVariant: 'featured', wishlistCardHeight: cardHeight}} style={styles.topHeart} color={colors.text} />}

      {/* Image */}
      <NetworkVehicleImage
        uri={item.image}
        fallbackUri={item.image}
        style={[styles.topCarImage, item.isDemo && styles.demoImage, cardHeight && {height: undefined, flex: 1, minHeight: 20, marginTop: 0}]}
      />

      {inlineDetails ? <>
        <View style={styles.titleRow}>
          <Text style={styles.inlineTitle} numberOfLines={1}>{item.title}</Text>
          <WishlistHeart item={{...item, wishlistCardVariant: 'featured', wishlistCardHeight: cardHeight}} style={styles.inlineHeart} color={colors.text} />
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.inlineSpecs}>{[item.fuel, item.transmission].filter(Boolean).join(' • ')}</Text>
          <Text style={styles.priceBadge}>{item.price}</Text>
        </View>
      </> : <>
        {/* Title */}
        <Text style={[styles.topCarTitle, cardHeight && {marginTop: 4, fontSize: 13}]} numberOfLines={1}>
          {item.title}
        </Text>

        {/* Details */}
        <Text style={[styles.topDetails, cardHeight && {marginTop: 2}]} numberOfLines={1}>
          {item.fuel} • {item.transmission}
        </Text>

        {/* Price */}
        <Text style={[styles.topPrice, cardHeight && {marginTop: 3, fontSize: 13}]} numberOfLines={1}>{item.price}</Text>
      </>}

    </TouchableOpacity>
  );
};

export default TopVehicleCard;

const createStyles = colors => StyleSheet.create({
  demoImage: {resizeMode: 'contain'},
  titleRow: {flexDirection: 'row', alignItems: 'center', marginTop: 4},
  inlineTitle: {flex: 1, fontSize: 13, fontWeight: '700', color: colors.text},
  inlineHeart: {minWidth: 28, minHeight: 28, alignItems: 'center', justifyContent: 'center', marginLeft: 4},
  detailsRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4, marginTop: 2},
  inlineSpecs: {flex: 1, fontSize: 10, lineHeight: 14, color: colors.textMuted},
  priceBadge: {flexShrink: 1, fontSize: 11, fontWeight: '700', color: colors.text, backgroundColor: colors.accentSurface, paddingHorizontal: 6, paddingVertical: 5, borderRadius: 6},
  inlineBookmark: {top: 10, bottom: undefined, right: 10},
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
