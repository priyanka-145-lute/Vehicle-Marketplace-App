import {useThemeStyles} from '../theme/colors';
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';

// ─── Custom Components ────────────────────────────────────────────────────────
import VehicleCard from '../components/VehicleCard';
import TopVehicleCard from '../components/TopVehicleCard';
import CategoryTab from '../components/CategoryTab';
import Header from '../components/Header';
import SectionHeader from '../components/SectionHeader';
import SearchBar from '../components/SearchBar';
import {CARS, OTHER_VEHICLES, TWO_WHEELERS} from '../data/vehicleCatalog';

const {width} = Dimensions.get('window');
const FEATURED_CARD_INTERVAL = width * 0.44 + 16;

const catalog = [...CARS, ...TWO_WHEELERS, ...OTHER_VEHICLES].map(item => ({
  ...item,
  price: '₹ ' + item.price.toLocaleString('en-IN'),
}));
const catalogKey = item => item.vehicleType + ':' + item.id;

// ─── Category Maps ────────────────────────────────────────────────────────────
const CATEGORIES = {
  '4wheeler': ['All', 'Hatchback', 'SUV', 'Sedan'],
  '2wheeler': ['All', 'Sports', 'Scooter', 'Cruiser'],
  other: ['All', 'Bus', 'Auto Rickshaw', 'Truck', 'Tractor'],
};

// ─── VehicleScreen ────────────────────────────────────────────────────────────
const VehicleScreen = () => {
  const {styles} = useThemeStyles(createStyles);

  const route = useRoute();
  const navigation = useNavigation();
  const {vehicleType} = route.params;

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featuredListRef = useRef(null);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [controlsHeight, setControlsHeight] = useState(0);
  const cardHeight = Math.max(110, Math.floor((viewportHeight - headerHeight - controlsHeight - 16) / 3));

  const vehicles = catalog.filter(item => (item.vehicleType || item.type) === vehicleType);
  const categories = [...new Set([...(CATEGORIES[vehicleType] ?? ['All']), ...vehicles.map(item => item.category)])];
  const filteredData = selectedCategory === 'All' ? vehicles : vehicles.filter(item => item.category === selectedCategory);

  // Top 2 for the featured horizontal strip
  const featuredData = filteredData.slice(0, 2);

  useEffect(() => {
    if (featuredData.length < 2) {
      setFeaturedIndex(0);
      return undefined;
    }

    const slider = setInterval(() => {
      setFeaturedIndex(currentIndex => {
        const nextIndex = (currentIndex + 1) % featuredData.length;
        featuredListRef.current?.scrollToIndex({index: nextIndex, animated: true});
        return nextIndex;
      });
    }, 3500);

    return () => clearInterval(slider);
  }, [featuredData.length]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} onLayout={event => setViewportHeight(event.nativeEvent.layout.height)}>
        <View testID="vehicle-header" onLayout={event => setHeaderHeight(event.nativeEvent.layout.height)}>

        {/* ── Header ── */}
          <Header />

        {/* ── Search Bar ── */}
        <SearchBar
          placeholder="Search vehicles..."
          onFilterPress={() => console.log('Filter pressed')}
        />

        {/* ── New Vehicles Section ── */}
        <SectionHeader
          compact
          emoji="🔥"
          title="New Vehicles"
          onViewAll={() => {
            if (vehicleType === '2wheeler') {
              navigation.navigate('AllTwoWheelers');
            } else if (vehicleType === '4wheeler') {
              navigation.navigate('AllFourWheelers');
            } else if (vehicleType === 'other') {
              navigation.navigate('AllOtherVehicles');
            } else {
              console.log('View all new');
            }
          }}
        />
        </View>

        {/* Featured horizontal cards */}
        <FlatList
          ref={featuredListRef}
          horizontal
          data={featuredData}
          keyExtractor={catalogKey}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={event => {
            setFeaturedIndex(Math.round(event.nativeEvent.contentOffset.x / FEATURED_CARD_INTERVAL));
          }}
          renderItem={({item}) => (
            <TopVehicleCard
              inlineDetails
              cardHeight={cardHeight}
              item={item}
              onPress={() => {
                if (vehicleType === '2wheeler') {
                  navigation.navigate('TwoWheelerDetail', {item});
                } else if (vehicleType === '4wheeler') {
                  navigation.navigate('FourWheelerDetail', {item, vehicleType: '4wheeler'});
                } else if (vehicleType === 'other') {
                  navigation.navigate('OtherVehicleDetail', {item, vehicleType: 'other'});
                } else {
                  console.log('Top card pressed:', item.title);
                }
              }}
            />
          )}
        />

        {/* Pagination Dots */}
        <View testID="vehicle-controls" onLayout={event => setControlsHeight(event.nativeEvent.layout.height)}>
        <View style={[styles.dotContainer, {marginTop: 8}]}>
          {featuredData.map((item, index) => (
            <View
              key={catalogKey(item)}
              style={featuredIndex === index ? styles.activeDot : styles.dot}
            />
          ))}
        </View>

        {/* ── All Vehicles Section ── */}
        <SectionHeader
          compact
          emoji="🚘"
          title="All Vehicles"
          onViewAll={() => {
            if (vehicleType === '2wheeler') {
              navigation.navigate('AllTwoWheelers');
            } else if (vehicleType === '4wheeler') {
              navigation.navigate('AllFourWheelers');
            } else if (vehicleType === 'other') {
              navigation.navigate('AllOtherVehicles');
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
        </View>

        {/* Vehicle Grid */}
        <FlatList
          data={filteredData}
          keyExtractor={catalogKey}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({item}) => (
            <VehicleCard
              inlineDetails
              cardHeight={cardHeight}
              item={item}
              onPress={() => {
                if (vehicleType === '2wheeler') {
                  navigation.navigate('TwoWheelerDetail', {item});
                } else if (vehicleType === '4wheeler') {
                  navigation.navigate('FourWheelerDetail', {item, vehicleType: '4wheeler'});
                } else if (vehicleType === 'other') {
                  navigation.navigate('OtherVehicleDetail', {item, vehicleType: 'other'});
                } else {
                  console.log('Card pressed:', item.title);
                }
              }}
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
const createStyles = colors => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    color: colors.text,
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
