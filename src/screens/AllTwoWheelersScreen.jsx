import {colors} from '../theme/colors';
import React, {useMemo, useState} from 'react';
import {FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import TwoWheelerFilterDrawer, {TWO_WHEELER_FILTER_DEFAULTS} from '../components/TwoWheelerFilterDrawer';
import WishlistHeart from '../components/WishlistHeart';
import NetworkVehicleImage from '../components/NetworkVehicleImage';

const TWO_WHEELERS = [
  {id: '1', title: 'Yamaha R15 V4', brand: 'Yamaha', model: 'R15 V4', year: 2025, type: 'Motorcycle', fuel: 'Petrol', price: 185000, image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/103795/r15-v4-right-front-three-quarter.jpeg'},
  {id: '2', title: 'Honda Activa 6G', brand: 'Honda', model: 'Activa 6G', year: 2024, type: 'Scooter', fuel: 'Petrol', price: 85000, image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/44686/activa-6g-right-front-three-quarter.jpeg'},
  {id: '3', title: 'Royal Enfield Classic 350', brand: 'Royal Enfield', model: 'Classic 350', year: 2023, type: 'Motorcycle', fuel: 'Petrol', price: 210000, image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/183389/classic-350-right-side-view.jpeg'},
  {id: '4', title: 'KTM Duke 390', brand: 'KTM', model: 'Duke 390', year: 2025, type: 'Motorcycle', fuel: 'Petrol', price: 320000, image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/183523/duke-390-right-front-three-quarter.jpeg'},
  {id: '5', title: 'Suzuki Access 125', brand: 'Suzuki', model: 'Access 125', year: 2022, type: 'Scooter', fuel: 'Petrol', price: 92000, image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=900&auto=format&fit=crop'},
  {id: '6', title: 'TVS Apache RTR 200', brand: 'TVS', model: 'Apache RTR 200', year: 2024, type: 'Motorcycle', fuel: 'Petrol', price: 148000, image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=900&auto=format&fit=crop'},
  {id: '7', title: 'Ather 450X', brand: 'Ather', model: '450X', year: 2025, type: 'Scooter', fuel: 'Electric', price: 145000, image: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?q=80&w=900&auto=format&fit=crop'},
  {id: '8', title: 'Bajaj Pulsar N160', brand: 'Bajaj', model: 'Pulsar N160', year: 2023, type: 'Motorcycle', fuel: 'Petrol', price: 135000, image: 'https://images.unsplash.com/photo-1524591652733-73fa1ae7b5ee?q=80&w=900&auto=format&fit=crop'},
];

const AllTwoWheelersScreen = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState(TWO_WHEELER_FILTER_DEFAULTS);

  const filteredVehicles = useMemo(() => TWO_WHEELERS.filter(item => {
    const searchMatches = item.title.toLowerCase().includes(search.trim().toLowerCase());
    const typeMatches = filters.type === 'All' || item.type === filters.type;
    const fuelMatches = filters.fuel === 'All' || item.fuel === filters.fuel;
    const priceMatches = item.price >= filters.minPrice && item.price <= filters.maxPrice;
    const fromMatches = filters.yearFrom === 'Any Year' || item.year >= Number(filters.yearFrom);
    const toMatches = filters.yearTo === 'Any Year' || item.year <= Number(filters.yearTo);
    const brandMatches = filters.brand === 'All Brands' || item.brand === filters.brand;
    const modelMatches = filters.model === 'All Models' || item.model === filters.model;
    return searchMatches && typeMatches && fuelMatches && priceMatches && fromMatches && toMatches && brandMatches && modelMatches;
  }), [filters, search]);

  const openFilters = () => setFilterVisible(true);

  const renderVehicle = ({item}) => (
    <TouchableOpacity activeOpacity={0.85} style={styles.card} onPress={() => navigation.navigate('TwoWheelerDetail', {item})}>
      <WishlistHeart item={item} vehicleType="2wheeler" style={styles.heart} size={19} color={colors.text} />
      <NetworkVehicleImage uri={item.image} fallbackUri="https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=900&auto=format&fit=crop" style={styles.image} />
      <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.details}>{item.type} • {item.fuel}</Text>
      <Text style={styles.price}>₹ {item.price.toLocaleString('en-IN')}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.filterButton} onPress={openFilters}><Icon name="menu" size={25} color="#fff" /></TouchableOpacity>
        <Text style={styles.heading}>Two Wheeler</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.searchBox}>
        <Icon name="search" size={20} color={colors.textMuted} />
        <TextInput value={search} onChangeText={setSearch} placeholder="Search bikes and scooters..." placeholderTextcolor={colors.textMuted} style={styles.searchInput} />
        {search ? <TouchableOpacity onPress={() => setSearch('')}><Icon name="close-circle" size={20} color={colors.textMuted} /></TouchableOpacity> : null}
      </View>

      <FlatList data={filteredVehicles} keyExtractor={item => item.id} numColumns={2} renderItem={renderVehicle} columnWrapperStyle={styles.columns} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} ListEmptyComponent={<View style={styles.empty}><Icon name="search-outline" size={42} color={colors.textMuted} /><Text style={styles.emptyText}>No two wheelers found</Text></View>} />

      <TwoWheelerFilterDrawer visible={filterVisible} filters={filters} onClose={() => setFilterVisible(false)} onApply={nextFilters => {setFilters(nextFilters); setFilterVisible(false);}} />
    </SafeAreaView>
  );
};

export default AllTwoWheelersScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background}, header: {minHeight: 72, paddingHorizontal: 14, paddingTop: 8, paddingBottom: 10, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center'}, filterButton: {width: 44, height: 44, borderRadius: 13, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center'}, heading: {flex: 1, fontSize: 23, fontWeight: '800', color: colors.text, textAlign: 'center'}, headerSpacer: {width: 44},
  searchBox: {height: 52, marginHorizontal: 14, marginTop: 14, paddingHorizontal: 14, borderRadius: 14, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', elevation: 2}, searchInput: {flex: 1, marginHorizontal: 10, fontSize: 14, color: colors.text},
  list: {paddingHorizontal: 10, paddingTop: 18, paddingBottom: 28}, columns: {justifyContent: 'space-between'}, card: {width: '48%', marginBottom: 14, padding: 10, borderRadius: 16, backgroundColor: colors.surface, elevation: 2}, heart: {position: 'absolute', top: 9, right: 9, zIndex: 2, width: 30, height: 30, borderRadius: 15, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center'}, image: {width: '100%', height: 115, borderRadius: 12, resizeMode: 'cover', backgroundColor: colors.surfaceMuted}, cardTitle: {fontSize: 14, fontWeight: '700', color: colors.text, marginTop: 10}, details: {fontSize: 11, color: colors.textMuted, marginTop: 5}, price: {fontSize: 15, fontWeight: '800', color: '#ef4444', marginTop: 7}, empty: {alignItems: 'center', paddingTop: 80}, emptyText: {fontSize: 15, color: colors.textMuted, marginTop: 10},
  overlay: {flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)'}, sheet: {maxHeight: '78%', padding: 20, paddingBottom: 26, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: colors.surface}, sheetHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10}, sheetTitle: {fontSize: 21, fontWeight: '800', color: colors.text}, label: {fontSize: 14, fontWeight: '700', color: colors.text, marginTop: 20, marginBottom: 10}, chipRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 9}, filterChip: {height: 39, paddingHorizontal: 14, borderRadius: 9, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center'}, filterChipActive: {borderColor: '#ef4444', backgroundColor: '#fff1f2'}, filterChipText: {fontSize: 13, color: '#475569'}, filterChipTextActive: {fontWeight: '700', color: '#ef4444'}, actions: {flexDirection: 'row', gap: 10, marginTop: 26}, clearButton: {flex: 1, height: 50, borderRadius: 12, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center'}, clearText: {fontSize: 15, fontWeight: '700', color: colors.text}, applyButton: {flex: 1.5, height: 50, borderRadius: 12, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center'}, applyText: {fontSize: 15, fontWeight: '700', color: '#fff'},
});
