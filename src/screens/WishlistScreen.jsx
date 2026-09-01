import React from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/Octicons';

const WishlistScreen = ({route}) => {

  // Dynamic Wishlist Data
  const wishlistData =
    route?.params?.wishlistData || [];

  const renderWishlistItem = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.card}>

        <Image
          source={{uri: item.image}}
          style={styles.image}
        />

        <View style={styles.content}>

          <Text
            numberOfLines={1}
            style={styles.title}>

            {item.title}

          </Text>

          <Text style={styles.details}>

            {item.fuel} •{' '}
            {item.transmission}

          </Text>

          <Text style={styles.price}>

            {item.price}

          </Text>

        </View>

        <TouchableOpacity>

          <Icon
            name="trash"
            size={20}
            color="red"
          />

        </TouchableOpacity>

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
          keyExtractor={item => item.id}
          renderItem={renderWishlistItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 16,
          }}
        />

      ) : (

        /* EMPTY SCREEN */

        <View style={styles.emptyContainer}>

          <Icon
            name="heart"
            size={70}
            color="#ddd"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  header: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 2,
  },

  headerTitle: {
    top: 8,
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
   
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },

  image: {
    width: 90,
    height: 70,
    resizeMode: 'contain',
  },

  content: {
    flex: 1,
    marginLeft: 14,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },

  details: {
    color: '#777',
    fontSize: 12,
    marginTop: 4,
  },

  price: {
    color: 'red',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 6,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    marginTop: 18,
  },

  emptySubtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 22,
  },
});