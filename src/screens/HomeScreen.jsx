import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import BannerSlider from '../components/BannerSlider';
import CategoryCard from '../components/CategoryCard';

import {categoryData} from '../data/dummyData';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>

      <Header />

      <SearchBar />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>

        {/* Main White Container */}
        <View style={styles.mainContainer}>

          {/* Banner */}
          <View style={styles.bannerWrapper}>
            <BannerSlider />
          </View>

          {/* Title */}
          <Text style={styles.sectionTitle}>
            Browse By Category
          </Text>

          {/* Cards */}
          <FlatList
            data={categoryData}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.listContainer}
            renderItem={({item}) => (
              <CategoryCard item={item} />
            )}
          />

        </View>

      </ScrollView>

    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },

  scrollContainer: {
    paddingBottom: 120,
    paddingHorizontal: 10,
    paddingTop: 10,
  },

  /* MAIN WHITE BOX */
  mainContainer: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingTop: 12,
    paddingBottom: 15,

    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },

    // shadowOpacity: 0.08,
    // shadowRadius: 4,
    // elevation: 4,
  },

  /* BANNER PERFECTLY INSIDE */
  bannerWrapper: {
    marginHorizontal: 10,
    borderRadius: 18,
    overflow: 'hidden',
  },

  sectionTitle: {
    marginTop: 8,
    marginBottom: 14,
    marginHorizontal: 14,
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },

  listContainer: {
    paddingHorizontal: 10,
  },
});