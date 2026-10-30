import {useThemeStyles} from '../theme/colors';
import React from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import {useWishlist} from '../context/WishlistContext';
import NetworkVehicleImage from '../components/NetworkVehicleImage';
import VehicleCard from '../components/VehicleCard';
import TopVehicleCard from '../components/TopVehicleCard';
import WishlistHeart from '../components/WishlistHeart';

import Icon from 'react-native-vector-icons/Octicons';

const WishlistScreen = ({navigation}) => {
  const {colors, styles} = useThemeStyles(createStyles);

  const {wishlistData} = useWishlist();

  const renderWishlistItem = ({item}) => {
    const vehicleType = item.vehicleType || item.type;
    const detailScreen = vehicleType === '2wheeler'
      ? 'TwoWheelerDetail'
      : vehicleType === 'other' ? 'OtherVehicleDetail' : 'FourWheelerDetail';
    const onPress = () => navigation.navigate(detailScreen, {item, vehicleType});
    if (item.wishlistCardVariant === 'featured') {
      return <TopVehicleCard item={item} onPress={onPress} cardHeight={item.wishlistCardHeight} style={styles.featuredCard} />;
    }
    if (item.wishlistCardVariant === 'grid' || item.type === vehicleType) {
      return <VehicleCard item={item} onPress={onPress} cardHeight={item.wishlistCardHeight} />;
    }
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate(detailScreen, {item, vehicleType})}
        style={styles.card}>

        <WishlistHeart item={item} vehicleType={vehicleType} style={styles.deleteButton} size={19} color={colors.text} />
        <NetworkVehicleImage
          uri={item.image}
          fallbackUri={(item.vehicleType || item.type) === '2wheeler'
            ? 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=900&auto=format&fit=crop'
            : (item.vehicleType || item.type) === 'other'
              ? 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=900&auto=format&fit=crop'
              : 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=900&auto=format&fit=crop'}
          style={styles.image}
        />

        <View style={styles.content}>

          <Text
            numberOfLines={1}
            style={styles.title}>

            {item.title}

          </Text>

          <Text style={styles.details}>

            {item.type && item.type !== vehicleType && vehicleType !== '4wheeler'
              ? `${item.type} • ${item.fuel}`
              : `${item.fuel} • ${item.transmission}`}

          </Text>

          <Text style={styles.price}>

            {typeof item.price === 'number' ? `₹ ${item.price.toLocaleString('en-IN')}` : item.price}

          </Text>

        </View>



      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>

        <Text style={styles.headerTitle}>
          Wishlist
        </Text>

      </View>

      {/* IF DATA EXISTS */}

      {wishlistData.length > 0 ? (

        <FlatList
          data={wishlistData}
          keyExtractor={item => item.wishlistKey}
          renderItem={renderWishlistItem}
          numColumns={2}
          columnWrapperStyle={styles.columns}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />

      ) : (

        /* EMPTY SCREEN */

        <View style={styles.emptyContainer}>

          <Icon
            name="heart"
            size={70}
            color={colors.textMuted}
          />

          <Text style={styles.emptyTitle}>
            No Wishlist Added
          </Text>

          <Text style={styles.emptySubtitle}>
            Vehicles added to wishlist
            will appear here.
          </Text>

        </View>

      )}

    </SafeAreaView>
  );
};

export default WishlistScreen;

const createStyles = colors => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    backgroundColor: colors.surface,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 2,
  },

  headerTitle: {
    top: 8,
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },

  list: {paddingHorizontal: 10, paddingTop: 18, paddingBottom: 28},
  columns: {justifyContent: 'space-between'},
  featuredCard: {width: '48%', marginLeft: 0, marginBottom: 8},
  card: {width: '48%', marginBottom: 14, padding: 10, borderRadius: 16, backgroundColor: colors.surface, elevation: 2},
  deleteButton: {position: 'absolute', top: 9, right: 9, zIndex: 2, width: 30, height: 30, borderRadius: 15, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center'},
  image: {width: '100%', height: 115, borderRadius: 12, resizeMode: 'cover', backgroundColor: colors.surfaceMuted},
  content: {},
  title: {fontSize: 14, fontWeight: '700', color: colors.text, marginTop: 10},
  details: {fontSize: 11, color: colors.textMuted, marginTop: 5},
  price: {fontSize: 15, fontWeight: '800', color: '#ef4444', marginTop: 7},

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginTop: 18,
  },

  emptySubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 22,
  },
});
