import {useThemeStyles} from '../theme/colors';
import React, {useMemo, useState} from 'react';
import {FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import FourWheelerFilterDrawer, {FOUR_WHEELER_FILTER_DEFAULTS} from '../components/FourWheelerFilterDrawer';
import WishlistHeart from '../components/WishlistHeart';
import NetworkVehicleImage from '../components/NetworkVehicleImage';

const CARS = [
  {id: '1', title: 'Maruti Suzuki Swift', brand: 'Maruti Suzuki', model: 'Swift', fuel: 'Petrol', transmission: 'Manual', bodyType: 'Hatchback', year: 2025, owner: '1st Owner', price: 650000, image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Maruti/Swift/9226/1687940953941/front-left-side-47.jpg'},
  {id: '2', title: 'Hyundai i20', brand: 'Hyundai', model: 'i20', fuel: 'Petrol', transmission: 'Manual', bodyType: 'Hatchback', year: 2024, owner: '1st Owner', price: 720000, image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Hyundai/i20/10148/1685604173114/front-left-side-47.jpg'},
  {id: '3', title: 'Tata Nexon', brand: 'Tata', model: 'Nexon', fuel: 'Diesel', transmission: 'AMT', bodyType: 'SUV', year: 2024, owner: '1st Owner', price: 800000, image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Tata/Nexon/9675/1730206352693/front-left-side-47.jpg'},
  {id: '4', title: 'Honda City', brand: 'Honda', model: 'City', fuel: 'Petrol', transmission: 'CVT', bodyType: 'Sedan', year: 2023, owner: '2nd Owner', price: 1250000, image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=900&auto=format&fit=crop'},
  {id: '5', title: 'Mahindra Thar', brand: 'Mahindra', model: 'Thar', fuel: 'Diesel', transmission: 'Automatic', bodyType: 'SUV', year: 2025, owner: '1st Owner', price: 1650000, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=900&auto=format&fit=crop'},
  {id: '6', title: 'Kia Seltos', brand: 'Kia', model: 'Seltos', fuel: 'Petrol', transmission: 'Automatic', bodyType: 'SUV', year: 2022, owner: '2nd Owner', price: 1450000, image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=900&auto=format&fit=crop'},
  {id: '7', title: 'Toyota Innova Crysta', brand: 'Toyota', model: 'Innova Crysta', fuel: 'Diesel', transmission: 'Manual', bodyType: 'MUV', year: 2021, owner: '2nd Owner', price: 2200000, image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=900&auto=format&fit=crop'},
  {id: '8', title: 'MG Hector', brand: 'MG', model: 'Hector', fuel: 'Hybrid', transmission: 'Automatic', bodyType: 'SUV', year: 2024, owner: '1st Owner', price: 1950000, image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=900&auto=format&fit=crop'},
];

const AllFourWheelersScreen = ({navigation}) => {
  const {colors, styles} = useThemeStyles(createStyles);

  const [search, setSearch] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState(FOUR_WHEELER_FILTER_DEFAULTS);
  const filteredCars = useMemo(() => CARS.filter(item => {
    const searchMatch = item.title.toLowerCase().includes(search.trim().toLowerCase());
    const brandMatch = filters.brand === 'All Brands' || item.brand === filters.brand;
    const modelMatch = filters.model === 'All Models' || item.model === filters.model;
    const fuelMatch = filters.fuel === 'All' || item.fuel === filters.fuel;
    const transmissionMatch = filters.transmission === 'All' || item.transmission === filters.transmission;
    const bodyMatch = filters.bodyType === 'All' || item.bodyType === filters.bodyType;
    const fromMatch = filters.yearFrom === 'Any Year' || item.year >= Number(filters.yearFrom);
    const toMatch = filters.yearTo === 'Any Year' || item.year <= Number(filters.yearTo);
    const ownerMatch = filters.owner === 'Any' || item.owner === filters.owner;
    return searchMatch && brandMatch && modelMatch && fuelMatch && transmissionMatch && bodyMatch && fromMatch && toMatch && ownerMatch && item.price >= filters.minPrice && item.price <= filters.maxPrice;
  }), [filters, search]);

  const renderCar = ({item}) => <TouchableOpacity activeOpacity={0.85} style={styles.card} onPress={() => navigation.navigate('FourWheelerDetail', {item, vehicleType: '4wheeler'})}><WishlistHeart item={item} vehicleType="4wheeler" style={styles.heart} size={19} color={colors.text} /><NetworkVehicleImage uri={item.image} fallbackUri="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=900&auto=format&fit=crop" style={styles.image} /><Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text><Text style={styles.details}>{item.fuel} • {item.transmission}</Text><Text style={styles.price}>₹ {item.price.toLocaleString('en-IN')}</Text></TouchableOpacity>;

  return <SafeAreaView style={styles.container}>
    <View style={styles.header}><TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(true)}><Icon name="menu" size={25} color="#fff" /></TouchableOpacity><Text style={styles.heading}>Four Wheeler</Text><View style={styles.spacer} /></View>
    <View style={styles.search}><Icon name="search" size={20} color={colors.textMuted} /><TextInput value={search} onChangeText={setSearch} placeholder="Search cars..." placeholderTextColor={colors.textMuted} style={styles.searchInput} />{search ? <TouchableOpacity onPress={() => setSearch('')}><Icon name="close-circle" size={20} color={colors.textMuted} /></TouchableOpacity> : null}</View>
    <FlatList data={filteredCars} keyExtractor={item => item.id} numColumns={2} renderItem={renderCar} columnWrapperStyle={styles.columns} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} ListEmptyComponent={<View style={styles.empty}><Icon name="car-outline" size={44} color={colors.textMuted} /><Text style={styles.emptyText}>No four wheelers found</Text></View>} />
    <FourWheelerFilterDrawer visible={filterVisible} filters={filters} onClose={() => setFilterVisible(false)} onApply={next => {setFilters(next); setFilterVisible(false);}} />
  </SafeAreaView>;
};

export default AllFourWheelersScreen;

const createStyles = colors => StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background}, header: {minHeight: 72, paddingHorizontal: 14, paddingTop: 8, paddingBottom: 10, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center'}, filterButton: {width: 44, height: 44, borderRadius: 13, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center'}, heading: {flex: 1, fontSize: 23, fontWeight: '800', color: colors.text, textAlign: 'center'}, spacer: {width: 44}, search: {height: 52, marginHorizontal: 14, marginTop: 14, paddingHorizontal: 14, borderRadius: 14, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', elevation: 2}, searchInput: {flex: 1, marginHorizontal: 10, fontSize: 14, color: colors.text},
  list: {paddingHorizontal: 10, paddingTop: 18, paddingBottom: 28}, columns: {justifyContent: 'space-between'}, card: {width: '48%', marginBottom: 14, padding: 10, borderRadius: 16, backgroundColor: colors.surface, elevation: 2}, heart: {position: 'absolute', top: 9, right: 9, zIndex: 2, width: 30, height: 30, borderRadius: 15, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center'}, image: {width: '100%', height: 115, borderRadius: 12, resizeMode: 'cover', backgroundColor: colors.surfaceMuted}, cardTitle: {fontSize: 14, fontWeight: '700', color: colors.text, marginTop: 10}, details: {fontSize: 11, color: colors.textMuted, marginTop: 5}, price: {fontSize: 15, fontWeight: '800', color: '#ef4444', marginTop: 7}, empty: {alignItems: 'center', paddingTop: 80}, emptyText: {fontSize: 15, color: colors.textMuted, marginTop: 10},
});
