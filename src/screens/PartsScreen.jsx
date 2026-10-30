import {useThemeStyles} from '../theme/colors';
import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import SearchBar from '../components/SearchBar';

const {width} = Dimensions.get('window');
const twoWheelerPartsImage = require('../assets/images/parts/two-wheeler-parts.png');
const fourWheelerPartsImage = require('../assets/images/parts/four-wheeler-parts.png');

const PARTS = {
  '2wheeler-parts': {
    title: 'Two Wheeler Old Parts',
    subtitle: 'Parts on sale for your bike & scooter',
    categoryLabel: 'Motorcycle & scooter parts only',
    productImage: twoWheelerPartsImage,
    banners: [
      {id: 'bike-sale', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1200&auto=format&fit=crop', offer: 'UP TO 30% OFF', label: 'Bike essentials on sale'},
      {id: 'helmet-sale', image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1200&auto=format&fit=crop', offer: 'RIDE SAFE, SAVE MORE', label: 'Limited-time riding offers'},
      {id: 'scooter-sale', image: 'https://images.unsplash.com/photo-1558980664-10ea8a61c6b4?q=80&w=1200&auto=format&fit=crop', offer: 'WEEKEND DEALS', label: 'Fresh offers every week'},
    ],
    items: [
      {id: 'b1', name: 'LED Headlight Assembly', brand: 'Universal fit', price: '₹ 1,499', oldPrice: '₹ 2,100', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600&auto=format&fit=crop'},
      {id: 'b2', name: 'Premium Brake Pads', brand: 'Honda / Hero', price: '₹ 599', oldPrice: '₹ 850', image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=600&auto=format&fit=crop'},
      {id: 'b3', name: 'Performance Air Filter', brand: 'Yamaha', price: '₹ 749', oldPrice: '₹ 1,050', image: 'https://images.unsplash.com/photo-1524591652733-73fa1ae7b5ee?q=80&w=600&auto=format&fit=crop'},
      {id: 'b4', name: 'Rear View Mirror Set', brand: 'Royal Enfield', price: '₹ 899', oldPrice: '₹ 1,250', image: 'https://images.unsplash.com/photo-1558980394-0c7d6b0393ae?q=80&w=600&auto=format&fit=crop'},
      {id: 'b5', name: 'Drive Chain & Sprocket Kit', brand: 'Bajaj / TVS', price: '₹ 1,299', oldPrice: '₹ 1,800', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600&auto=format&fit=crop'},
      {id: 'b6', name: 'Motorcycle Spark Plug', brand: 'NGK compatible', price: '₹ 249', oldPrice: '₹ 350', image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=600&auto=format&fit=crop'},
    ],
  },
  '4wheeler-parts': {
    title: 'Four Wheeler Old Parts',
    subtitle: 'Quality car parts at sale prices',
    categoryLabel: 'Car parts only',
    productImage: fourWheelerPartsImage,
    banners: [
      {id: 'car-sale', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop', offer: 'UP TO 25% OFF', label: 'Car care essentials on sale'},
      {id: 'garage-sale', image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=1200&auto=format&fit=crop', offer: 'SERVICE DAY DEALS', label: 'Get more for your car'},
      {id: 'road-sale', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop', offer: 'DRIVE & SAVE', label: 'Limited-time part offers'},
    ],
    items: [
      {id: 'c1', name: 'Bosch Wiper Blade Set', brand: 'All sedan models', price: '₹ 1,099', oldPrice: '₹ 1,450', image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=600&auto=format&fit=crop'},
      {id: 'c2', name: 'Car Battery 60 Ah', brand: 'Exide', price: '₹ 5,899', oldPrice: '₹ 6,750', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=600&auto=format&fit=crop'},
      {id: 'c3', name: 'Front Brake Disc Pair', brand: 'Maruti / Hyundai', price: '₹ 2,799', oldPrice: '₹ 3,500', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop'},
      {id: 'c4', name: 'Cabin Air Filter', brand: 'Premium carbon', price: '₹ 499', oldPrice: '₹ 699', image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=600&auto=format&fit=crop'},
      {id: 'c5', name: 'Engine Oil Filter', brand: 'Tata / Mahindra', price: '₹ 349', oldPrice: '₹ 499', image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=600&auto=format&fit=crop'},
      {id: 'c6', name: 'Car Tail Light Assembly', brand: 'Maruti Suzuki', price: '₹ 2,199', oldPrice: '₹ 2,950', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=600&auto=format&fit=crop'},
    ],
  },
};

const PartsScreen = ({navigation, route}) => {
  const {colors, styles} = useThemeStyles(createStyles);

  const catalog = PARTS[route.params?.partType] || PARTS['2wheeler-parts'];
  const insets = useSafeAreaInsets();
  const sliderRef = useRef(null);
  const [activeBanner, setActiveBanner] = useState(0);
  const [search, setSearch] = useState('');
  const items = catalog.items.filter(item => `${item.name} ${item.brand}`.toLowerCase().includes(search.trim().toLowerCase()));

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (activeBanner + 1) % catalog.banners.length;
      sliderRef.current?.scrollToIndex({index: nextIndex, animated: true});
    }, 3500);
    return () => clearInterval(timer);
  }, [activeBanner, catalog.banners.length]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, {paddingTop: insets.top + 10}]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} accessibilityLabel="Go back">
          <Icon name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}><Text style={styles.title}>{catalog.title}</Text><Text style={styles.subtitle}>{catalog.subtitle}</Text></View>
      </View>

      <SearchBar value={search} onChangeText={setSearch} placeholder="Search old parts..." />

      <FlatList
        ListHeaderComponent={(
          <>
            <Text style={styles.sectionHeading}>Featured Parts</Text>
            <FlatList
              ref={sliderRef}
              data={catalog.banners}
              horizontal
              getItemLayout={(_, index) => ({length: width, offset: width * index, index})}
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              onMomentumScrollEnd={event => setActiveBanner(Math.round(event.nativeEvent.contentOffset.x / width))}
              renderItem={({item}) => <View style={styles.banner}><Image source={catalog.productImage} style={styles.bannerImage} /><View style={styles.overlay} /><View style={styles.bannerText}><Text style={styles.offer}>{item.offer}</Text><Text style={styles.bannerLabel}>{item.label}</Text><View style={styles.shopButton}><Text style={styles.shopText}>SHOP SALE</Text></View></View></View>}
            />
            <View style={styles.dots}>{catalog.banners.map((item, index) => <View key={item.id} style={[styles.dot, activeBanner === index && styles.activeDot]} />)}</View>
            <View style={styles.saleHeading}>
              <Text style={styles.saleTitle}>All Parts</Text>
              <View style={styles.categoryChip}><Text style={styles.categoryChipText}>{catalog.categoryLabel}</Text></View>
            </View>
          </>
        )}
        data={items}
        ListEmptyComponent={<Text style={styles.emptyText}>No parts found</Text>}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[styles.list, {paddingBottom: insets.bottom + 20}]}
        renderItem={({item}) => <TouchableOpacity activeOpacity={0.85} style={styles.card}><View style={styles.badge}><Text style={styles.badgeText}>SALE</Text></View><Image source={catalog.productImage} style={styles.partImage} /><Text style={styles.partName} numberOfLines={2}>{item.name}</Text><Text style={styles.brand} numberOfLines={1}>{item.brand}</Text><View style={styles.priceRow}><Text style={styles.price}>{item.price}</Text><Text style={styles.oldPrice}>{item.oldPrice}</Text></View></TouchableOpacity>}
      />
    </View>
  );
};

export default PartsScreen;

const createStyles = colors => StyleSheet.create({
  sectionHeading: {fontSize: 17, fontWeight: '700', color: colors.text, marginHorizontal: 16, marginTop: 12}, emptyText: {padding: 24, textAlign: 'center', color: colors.textMuted},
  headerContent: {flex: 1},
  container: {flex: 1, backgroundColor: colors.background}, header: {paddingHorizontal: 15, paddingTop: 10, paddingBottom: 14, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', gap: 12}, backButton: {width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center'}, title: {fontSize: 19, fontWeight: '800', color: colors.text}, subtitle: {fontSize: 12, color: colors.textMuted, marginTop: 3}, banner: {width, height: 160, paddingHorizontal: 14, paddingTop: 14}, bannerImage: {width: width - 28, height: 146, borderRadius: 18, resizeMode: 'cover'}, overlay: {position: 'absolute', left: 14, right: 14, top: 14, height: 146, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.40)'}, bannerText: {position: 'absolute', left: 34, right: 24, top: 30}, offer: {fontSize: 23, fontWeight: '900', color: '#fff'}, bannerLabel: {fontSize: 13, color: '#fff', marginTop: 5}, shopButton: {marginTop: 14, alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 7, backgroundColor: '#ef4444'}, shopText: {fontSize: 10, fontWeight: '800', color: '#fff'}, dots: {flexDirection: 'row', justifyContent: 'center', marginTop: 4, marginBottom: 10}, dot: {width: 7, height: 7, marginHorizontal: 4, borderRadius: 4, backgroundColor: colors.textMuted}, activeDot: {width: 18, backgroundColor: '#ef4444'}, saleHeading: {marginHorizontal: 14, marginVertical: 8}, saleTitle: {fontSize: 17, fontWeight: '800', color: colors.text}, categoryChip: {alignSelf: 'flex-start', marginTop: 6, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 7, backgroundColor: colors.accentSurface}, categoryChipText: {fontSize: 11, fontWeight: '700', color: '#ef4444'}, list: {paddingBottom: 30}, row: {justifyContent: 'space-between', paddingHorizontal: 10}, card: {width: '48%', marginBottom: 14, padding: 10, borderRadius: 16, backgroundColor: colors.surface, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.07, shadowRadius: 6, elevation: 3}, badge: {position: 'absolute', top: 10, left: 10, zIndex: 1, paddingHorizontal: 7, paddingVertical: 4, borderRadius: 6, backgroundColor: '#ef4444'}, badgeText: {fontSize: 9, fontWeight: '800', color: '#fff'}, partImage: {width: '100%', height: 115, resizeMode: 'contain', borderRadius: 12, backgroundColor: colors.surfaceMuted}, partName: {fontSize: 15, fontWeight: '700', color: colors.text, marginTop: 10, minHeight: 38}, brand: {fontSize: 12, color: colors.textMuted, marginTop: 5}, priceRow: {flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 6}, price: {fontSize: 15, fontWeight: '700', color: 'red'}, oldPrice: {fontSize: 11, color: colors.textMuted, textDecorationLine: 'line-through'},
});
