import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';

// ─── Custom Components ────────────────────────────────────────────────────────
import VehicleCard from '../components/VehicleCard';
import TopVehicleCard from '../components/TopVehicleCard';
import CategoryTab from '../components/CategoryTab';
import Header from '../components/Header';
import SectionHeader from '../components/SectionHeader';
import SearchBar from '../components/SearchBar';

// ─── Vehicle Data ─────────────────────────────────────────────────────────────
const vehicleData = [
  // ── 4 Wheelers ──
  {
    id: '1',
    title: 'Swift 2024',
    fuel: 'Petrol',
    transmission: 'Manual',
    price: '₹ 6,50,000',
    category: 'Hatchback',
    type: '4wheeler',
    image:
      'https://stimg.cardekho.com/images/carexteriorimages/930x620/Maruti/Swift/9226/1687940953941/front-left-side-47.jpg',
  },
  {
    id: '2',
    title: 'i20 2024',
    fuel: 'Petrol',
    transmission: 'Manual',
    price: '₹ 7,20,000',
    category: 'Hatchback',
    type: '4wheeler',
    image:
      'https://stimg.cardekho.com/images/carexteriorimages/930x620/Hyundai/i20/10148/1685604173114/front-left-side-47.jpg',
  },
  {
    id: '3',
    title: 'Nexon 2024',
    fuel: 'Diesel',
    transmission: 'Manual',
    price: '₹ 8,00,000',
    category: 'SUV',
    type: '4wheeler',
    image:
      'https://stimg.cardekho.com/images/carexteriorimages/930x620/Tata/Nexon/9675/1730206352693/front-left-side-47.jpg',
  },
  {
    id: '4',
    title: 'Creta 2024',
    fuel: 'Petrol',
    transmission: 'Automatic',
    price: '₹ 11,00,000',
    category: 'SUV',
    type: '4wheeler',
    image:
      'https://stimg.cardekho.com/images/carexteriorimages/930x620/Hyundai/Creta/9829/1696253789133/front-left-side-47.jpg',
  },
  {
    id: '4b',
    title: 'City 2024',
    fuel: 'Petrol',
    transmission: 'Automatic',
    price: '₹ 12,50,000',
    category: 'Sedan',
    type: '4wheeler',
    image:
      'https://stimg.cardekho.com/images/carexteriorimages/930x620/Tata/Nexon/9675/1730206352693/front-left-side-47.jpg',
  },

  // ── 2 Wheelers ──
  {
    id: '5',
    title: 'Yamaha R15 V4',
    fuel: 'Petrol',
    transmission: 'Manual',
    price: '₹ 1,85,000',
    category: 'Sports',
    type: '2wheeler',
    image:
      'https://imgd.aeplcdn.com/664x374/n/cw/ec/103795/r15-v4-right-front-three-quarter.jpeg',
  },
  {
    id: '6',
    title: 'Activa 6G',
    fuel: 'Petrol',
    transmission: 'Automatic',
    price: '₹ 85,000',
    category: 'Scooter',
    type: '2wheeler',
    image:
      'https://imgd.aeplcdn.com/664x374/n/cw/ec/44686/activa-6g-right-front-three-quarter.jpeg',
  },
  {
    id: '7',
    title: 'Royal Enfield',
    fuel: 'Petrol',
    transmission: 'Manual',
    price: '₹ 2,10,000',
    category: 'Cruiser',
    type: '2wheeler',
    image:
      'https://imgd.aeplcdn.com/664x374/n/cw/ec/183389/classic-350-right-side-view.jpeg',
  },
  {
    id: '8',
    title: 'KTM Duke 390',
    fuel: 'Petrol',
    transmission: 'Manual',
    price: '₹ 3,20,000',
    category: 'Sports',
    type: '2wheeler',
    image:
      'https://imgd.aeplcdn.com/664x374/n/cw/ec/183523/duke-390-right-front-three-quarter.jpeg',
  },
];

// ─── Category Maps ────────────────────────────────────────────────────────────
const CATEGORIES = {
  '4wheeler': ['All', 'Hatchback', 'SUV', 'Sedan'],
  '2wheeler': ['All', 'Sports', 'Scooter', 'Cruiser'],
};

// ─── VehicleScreen ────────────────────────────────────────────────────────────
const VehicleScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {vehicleType} = route.params;

  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = CATEGORIES[vehicleType] ?? ['All'];

  // Filter data by vehicle type + selected category
  const filteredData =
    selectedCategory === 'All'
      ? vehicleData.filter(item => item.type === vehicleType)
      : vehicleData.filter(
          item =>
            item.type === vehicleType && item.category === selectedCategory,
        );

  // Top 2 for the featured horizontal strip
  const featuredData = filteredData.slice(0, 2);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
          <Header />

        {/* ── Search Bar ── */}
        <SearchBar
          placeholder="Search vehicles..."
          onFilterPress={() => console.log('Filter pressed')}
        />

        {/* ── New Vehicles Section ── */}
        <SectionHeader
          emoji="🔥"
          title="New Vehicles"
          onViewAll={() => {
            if (vehicleType === '2wheeler') {
              navigation.navigate('AllTwoWheelers');
            } else if (vehicleType === '4wheeler') {
              navigation.navigate('AllFourWheelers');
            } else {
              console.log('View all new');
            }
          }}
        />

        {/* Featured horizontal cards */}
        <FlatList
          horizontal
          data={featuredData}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <TopVehicleCard
              item={item}
              onPress={() => {
                if (vehicleType === '2wheeler') {
                  navigation.navigate('TwoWheelerDetail', {item});
                } else if (vehicleType === '4wheeler') {
                  navigation.navigate('FourWheelerDetail', {item, vehicleType: '4wheeler'});
                } else {
                  console.log('Top card pressed:', item.title);
                }
              }}
              onHeartPress={() => console.log('Heart pressed:', item.title)}
            />
          )}
        />

        {/* Pagination Dots */}
        <View style={styles.dotContainer}>
          <View style={styles.activeDot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        {/* ── All Vehicles Section ── */}
        <SectionHeader
          emoji="🚘"
          title="All Vehicles"
          onViewAll={() => {
            if (vehicleType === '2wheeler') {
              navigation.navigate('AllTwoWheelers');
            } else if (vehicleType === '4wheeler') {
              navigation.navigate('AllFourWheelers');
            } else {
              console.log('View all vehicles');
            }
          }}
        />

        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}>
          {categories.map(cat => (
            <CategoryTab
              key={cat}
              label={cat}
              isSelected={selectedCategory === cat}
              onPress={() => setSelectedCategory(cat)}
            />
          ))}
        </ScrollView>

        {/* Vehicle Grid */}
        <FlatList
          data={filteredData}
          keyExtractor={item => item.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({item}) => (
            <VehicleCard
              item={item}
              onPress={() => {
                if (vehicleType === '2wheeler') {
                  navigation.navigate('TwoWheelerDetail', {item});
                } else if (vehicleType === '4wheeler') {
                  navigation.navigate('FourWheelerDetail', {item, vehicleType: '4wheeler'});
                } else {
                  console.log('Card pressed:', item.title);
                }
              }}
              onHeartPress={() => console.log('Liked:', item.title)}
              onBookmarkPress={() => console.log('Saved:', item.title)}
            />
          )}
        />

      </ScrollView>
    </SafeAreaView>
  );
};

export default VehicleScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 15,
  },
  logo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartIcon: {
    marginLeft: 15,
  },

  // Dots
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  activeDot: {
    width: 16,
    height: 6,
    borderRadius: 10,
    backgroundColor: 'red',
    marginHorizontal: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: '#bbb',
    marginHorizontal: 4,
  },

  // Tabs
  tabsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },

  // Grid
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
});
