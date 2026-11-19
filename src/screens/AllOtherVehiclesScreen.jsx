import {useThemeStyles} from '../theme/colors';
import React, {useMemo, useState} from 'react';
import {FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import OtherVehicleFilterDrawer, {OTHER_FILTER_DEFAULTS} from '../components/OtherVehicleFilterDrawer';
import WishlistHeart from '../components/WishlistHeart';
import NetworkVehicleImage from '../components/NetworkVehicleImage';

import {OTHER_VEHICLES} from '../data/vehicleCatalog';

const AllOtherVehiclesScreen = ({navigation}) => {
  const {colors, styles} = useThemeStyles(createStyles);

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
  const renderVehicle = ({item}) => <TouchableOpacity activeOpacity={0.85} style={styles.card} onPress={() => navigation.navigate('OtherVehicleDetail', {item, vehicleType: 'other'})}><NetworkVehicleImage uri={item.image} fallbackUri={item.image} style={styles.image} /><View style={styles.titleRow}><Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text><WishlistHeart item={item} vehicleType="other" style={styles.heart} size={19} color={colors.text} /></View><View style={styles.detailsRow}><Text style={styles.details}>{item.type} • {item.fuel}</Text><Text style={styles.price}>₹ {item.price.toLocaleString('en-IN')}</Text></View></TouchableOpacity>;
  return <SafeAreaView style={styles.container}>
    <View style={styles.header}><TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(true)}><Icon name="menu" size={25} color="#fff" /></TouchableOpacity><Text style={styles.heading}>Other Vehicles</Text><View style={styles.spacer} /></View>
    <View style={styles.search}><Icon name="search" size={20} color={colors.textMuted} /><TextInput value={search} onChangeText={setSearch} placeholder="Search other vehicles..." placeholderTextColor={colors.textMuted} style={styles.searchInput} />{search ? <TouchableOpacity onPress={() => setSearch('')}><Icon name="close-circle" size={20} color={colors.textMuted} /></TouchableOpacity> : null}</View>
    <FlatList data={vehicles} keyExtractor={item => item.id} numColumns={2} renderItem={renderVehicle} columnWrapperStyle={styles.columns} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} ListEmptyComponent={<View style={styles.empty}><Icon name="bus-outline" size={44} color={colors.textMuted} /><Text style={styles.emptyText}>No vehicles found</Text></View>} />
    <OtherVehicleFilterDrawer visible={filterVisible} filters={filters} onClose={() => setFilterVisible(false)} onApply={next => {setFilters(next); setFilterVisible(false);}} />
  </SafeAreaView>;
};
export default AllOtherVehiclesScreen;

const createStyles = colors => StyleSheet.create({
  titleRow: {flexDirection: 'row', alignItems: 'center', marginTop: 6},
  detailsRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4, marginTop: 4},
  container: {flex: 1, backgroundColor: colors.background}, header: {minHeight: 72, paddingHorizontal: 14, paddingTop: 8, paddingBottom: 10, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center'}, filterButton: {width: 44, height: 44, borderRadius: 13, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center'}, heading: {flex: 1, fontSize: 23, fontWeight: '800', color: colors.text, textAlign: 'center'}, spacer: {width: 44}, search: {height: 52, marginHorizontal: 14, marginTop: 14, paddingHorizontal: 14, borderRadius: 14, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', elevation: 2}, searchInput: {flex: 1, marginHorizontal: 10, fontSize: 14, color: colors.text},
  list: {paddingHorizontal: 10, paddingTop: 18, paddingBottom: 28}, columns: {justifyContent: 'space-between'}, card: {width: '48%', marginBottom: 14, padding: 10, borderRadius: 16, backgroundColor: colors.surface, elevation: 2}, heart: {marginLeft: 4, width: 30, height: 30, borderRadius: 15, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center'}, image: {width: '100%', height: 115, borderRadius: 12, resizeMode: 'contain', backgroundColor: colors.surfaceMuted}, cardTitle: {flex: 1, fontSize: 14, fontWeight: '700', color: colors.text}, details: {flex: 1, fontSize: 10, lineHeight: 14, color: colors.textMuted}, price: {flexShrink: 1, fontSize: 11, fontWeight: '800', color: colors.text, backgroundColor: colors.accentSurface, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 5}, empty: {alignItems: 'center', paddingTop: 80}, emptyText: {fontSize: 15, color: colors.textMuted, marginTop: 10},
});
