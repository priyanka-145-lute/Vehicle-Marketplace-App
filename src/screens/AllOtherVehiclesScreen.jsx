import React, {useMemo, useState} from 'react';
import {FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import OtherVehicleFilterDrawer, {OTHER_FILTER_DEFAULTS} from '../components/OtherVehicleFilterDrawer';
import WishlistHeart from '../components/WishlistHeart';
import NetworkVehicleImage from '../components/NetworkVehicleImage';

const OTHER_VEHICLES = [
  {id: '1', title: 'Tata Starbus', brand: 'Tata', model: 'Starbus', type: 'School Bus', fuel: 'Diesel', year: 2024, price: 1850000, image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=900&auto=format&fit=crop'},
  {id: '2', title: 'Bajaj RE Auto', brand: 'Bajaj', model: 'RE Auto', type: 'Auto Rickshaw', fuel: 'CNG', year: 2023, price: 375000, image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=900&auto=format&fit=crop'},
  {id: '3', title: 'Eicher Pro 3016', brand: 'Eicher', model: 'Pro 3016', type: 'Truck', fuel: 'Diesel', year: 2024, price: 2650000, image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=900&auto=format&fit=crop'},
  {id: '4', title: 'Tata 407 Gold', brand: 'Tata', model: '407 Gold', type: 'Mini Truck', fuel: 'Diesel', year: 2024, price: 2890000, image: 'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?q=80&w=900&auto=format&fit=crop'},
  {id: '5', title: 'JCB 3DX Plus', brand: 'JCB', model: '3DX Plus', type: 'Crane', fuel: 'Diesel', year: 2025, price: 3250000, image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=900&auto=format&fit=crop'},
  {id: '6', title: 'Ashok Leyland Dost+', brand: 'Ashok Leyland', model: 'Dost+', type: 'LCV', fuel: 'Diesel', year: 2024, price: 720000, image: 'https://images.unsplash.com/photo-1485575301924-6891ef935dcd?q=80&w=900&auto=format&fit=crop'},
  {id: '7', title: 'Force Traveller', brand: 'Force', model: 'Traveller', type: 'Van', fuel: 'Diesel', year: 2023, price: 1680000, image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=900&auto=format&fit=crop'},
  {id: '8', title: 'Swaraj 744 FE', brand: 'Swaraj', model: '744 FE', type: 'Tractor', fuel: 'Diesel', year: 2024, price: 710000, image: 'https://images.unsplash.com/photo-1515569067071-ec3b51335dd0?q=80&w=900&auto=format&fit=crop'},
  {id: '9', title: 'ACE Hydra 12XW', brand: 'ACE', model: 'Hydra 12XW', type: 'Crane', fuel: 'Diesel', year: 2024, price: 4500000, image: 'https://images.unsplash.com/photo-1501706362039-c6e80948bb60?q=80&w=900&auto=format&fit=crop'},
  {id: '10', title: 'Godrej RX 20', brand: 'Godrej', model: 'RX 20', type: 'Forklift', fuel: 'Electric', year: 2025, price: 890000, image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=900&auto=format&fit=crop'},
];

const AllOtherVehiclesScreen = ({navigation}) => {
  const [search, setSearch] = useState(''); const [filterVisible, setFilterVisible] = useState(false); const [filters, setFilters] = useState(OTHER_FILTER_DEFAULTS);
  const vehicles = useMemo(() => OTHER_VEHICLES.filter(item => {
    const searchMatch = item.title.toLowerCase().includes(search.trim().toLowerCase());
    const typeMatch = filters.type === 'All' || item.type === filters.type;
    const fuelMatch = filters.fuel === 'All' || item.fuel === filters.fuel;
    const brandMatch = filters.brand === 'All Brands' || item.brand === filters.brand;
    const modelMatch = filters.model === 'All Models' || item.model === filters.model;
    const fromMatch = filters.yearFrom === 'Any Year' || item.year >= Number(filters.yearFrom);
    const toMatch = filters.yearTo === 'Any Year' || item.year <= Number(filters.yearTo);
    return searchMatch && typeMatch && fuelMatch && brandMatch && modelMatch && fromMatch && toMatch && item.price >= filters.minPrice && item.price <= filters.maxPrice;
  }), [filters, search]);
  const renderVehicle = ({item}) => <TouchableOpacity activeOpacity={0.85} style={styles.card} onPress={() => navigation.navigate('OtherVehicleDetail', {item, vehicleType: 'other'})}><WishlistHeart item={item} vehicleType="other" style={styles.heart} size={19} color="#334155" /><NetworkVehicleImage uri={item.image} fallbackUri="https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=900&auto=format&fit=crop" style={styles.image} /><Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text><Text style={styles.details}>{item.type} • {item.fuel}</Text><Text style={styles.price}>₹ {item.price.toLocaleString('en-IN')}</Text></TouchableOpacity>;
  return <SafeAreaView style={styles.container}>
    <View style={styles.header}><TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(true)}><Icon name="menu" size={25} color="#fff" /></TouchableOpacity><Text style={styles.heading}>Other Vehicles</Text><View style={styles.spacer} /></View>
    <View style={styles.search}><Icon name="search" size={20} color="#777" /><TextInput value={search} onChangeText={setSearch} placeholder="Search other vehicles..." placeholderTextColor="#777" style={styles.searchInput} />{search ? <TouchableOpacity onPress={() => setSearch('')}><Icon name="close-circle" size={20} color="#999" /></TouchableOpacity> : null}</View>
    <FlatList data={vehicles} keyExtractor={item => item.id} numColumns={2} renderItem={renderVehicle} columnWrapperStyle={styles.columns} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} ListEmptyComponent={<View style={styles.empty}><Icon name="bus-outline" size={44} color="#94a3b8" /><Text style={styles.emptyText}>No vehicles found</Text></View>} />
    <OtherVehicleFilterDrawer visible={filterVisible} filters={filters} onClose={() => setFilterVisible(false)} onApply={next => {setFilters(next); setFilterVisible(false);}} />
  </SafeAreaView>;
};
export default AllOtherVehiclesScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f4f4f4'}, header: {minHeight: 72, paddingHorizontal: 14, paddingTop: 8, paddingBottom: 10, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center'}, filterButton: {width: 44, height: 44, borderRadius: 13, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center'}, heading: {flex: 1, fontSize: 23, fontWeight: '800', color: '#111', textAlign: 'center'}, spacer: {width: 44}, search: {height: 52, marginHorizontal: 14, marginTop: 14, paddingHorizontal: 14, borderRadius: 14, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', elevation: 2}, searchInput: {flex: 1, marginHorizontal: 10, fontSize: 14, color: '#111'},
  list: {paddingHorizontal: 10, paddingTop: 18, paddingBottom: 28}, columns: {justifyContent: 'space-between'}, card: {width: '48%', marginBottom: 14, padding: 10, borderRadius: 16, backgroundColor: '#fff', elevation: 2}, heart: {position: 'absolute', top: 9, right: 9, zIndex: 2, width: 30, height: 30, borderRadius: 15, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center'}, image: {width: '100%', height: 115, borderRadius: 12, resizeMode: 'cover', backgroundColor: '#f1f5f9'}, cardTitle: {fontSize: 14, fontWeight: '700', color: '#111', marginTop: 10}, details: {fontSize: 11, color: '#64748b', marginTop: 5}, price: {fontSize: 15, fontWeight: '800', color: '#ef4444', marginTop: 7}, empty: {alignItems: 'center', paddingTop: 80}, emptyText: {fontSize: 15, color: '#64748b', marginTop: 10},
});
