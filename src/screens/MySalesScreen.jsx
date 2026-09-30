import {colors} from '../theme/colors';
import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import NetworkVehicleImage from '../components/NetworkVehicleImage';

const STORAGE_KEY = 'vehicle-my-sales';
const EMPTY = {title: '', category: '4 Wheeler', price: '', year: '', fuel: '', location: '', image: '', description: ''};

const MySalesScreen = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const busy = useRef(false);
  const [filter, setFilter] = useState('All');
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY);
      const data = value ? JSON.parse(value) : [];
      if (!Array.isArray(data) || data.some(item => !item || typeof item.id !== 'string' || typeof item.title !== 'string' || !Number.isFinite(item.price) || !['Active', 'Sold'].includes(item.status))) {throw new Error('Invalid listings');}
      setListings(data);
    } catch {setLoadError(true);} finally {setLoading(false);}
  };
  useEffect(() => {load();}, []);

  const persist = async next => {
    if (busy.current) {return false;}
    busy.current = true;
    setSaving(true);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setListings(next);
      return true;
    } catch {
      Alert.alert('Could not save', 'Your changes were not saved. Please try again.');
      return false;
    } finally {busy.current = false; setSaving(false);}
  };
  const openForm = item => {
    setEditingId(item?.id || null);
    setForm(item ? {...EMPTY, ...item, price: String(item.price)} : {...EMPTY});
    setError('');
    setVisible(true);
  };
  const save = async () => {
    const price = Number(form.price.replace(/,/g, ''));
    if (!form.title.trim() || !form.location.trim() || !form.fuel.trim()) {setError('Enter a vehicle name, fuel type and location.'); return;}
    if (!Number.isFinite(price) || price <= 0) {setError('Enter a valid price greater than zero.'); return;}
    if (!/^\d{4}$/.test(form.year) || Number(form.year) < 1900 || Number(form.year) > new Date().getFullYear() + 1) {setError('Enter a valid four-digit model year.'); return;}
    if (form.image.trim() && !/^https?:\/\/\S+$/i.test(form.image.trim())) {setError('Enter a valid photo URL starting with https:// or http://.'); return;}
    const previous = listings.find(item => item.id === editingId);
    const item = {...form, title: form.title.trim(), fuel: form.fuel.trim(), location: form.location.trim(), image: form.image.trim(), description: form.description.trim(), price, id: editingId || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, status: previous?.status || 'Active'};
    if (await persist(editingId ? listings.map(saved => saved.id === editingId ? item : saved) : [item, ...listings])) {setVisible(false); setFilter('All');}
  };
  const remove = item => Alert.alert('Delete listing?', `Remove ${item.title} from My Sales?`, [{text: 'Cancel', style: 'cancel'}, {text: 'Delete', style: 'destructive', onPress: () => persist(listings.filter(saved => saved.id !== item.id))}]);
  const markSold = item => Alert.alert('Mark as sold?', `${item.title} will move to Sold.`, [{text: 'Cancel', style: 'cancel'}, {text: 'Mark as Sold', onPress: () => persist(listings.map(saved => saved.id === item.id ? {...saved, status: 'Sold'} : saved))}]);
  const button = (label, onPress, style = styles.primary, disabled = saving) => <TouchableOpacity accessibilityRole="button" disabled={disabled} onPress={onPress} style={[style, disabled && styles.disabled]}><Text style={style === styles.primary ? styles.primaryText : styles.actionText}>{label}</Text></TouchableOpacity>;
  const field = (key, label, options = {}) => <View style={styles.field} key={key}><Text style={styles.label}>{label}</Text><TextInput accessibilityLabel={label} style={[styles.input, options.multiline && styles.multiline]} value={form[key]} onChangeText={value => setForm(current => ({...current, [key]: value}))} editable={!saving} placeholderTextcolor={colors.textMuted} {...options} /></View>;
  const renderListing = ({item}) => <View style={styles.card}>
    <View style={styles.row}>
      {item.image ? <NetworkVehicleImage uri={item.image} fallbackUri={item.image} style={styles.image} /> : <View style={[styles.image, styles.placeholder]}><Icon name="car-sport-outline" size={36} color={colors.textMuted} /></View>}
      <View style={styles.info}><View style={styles.statusRow}><Text style={styles.category}>{item.category}</Text><Text style={[styles.badge, item.status === 'Sold' && styles.soldBadge]}>{item.status}</Text></View><Text style={styles.vehicleTitle} numberOfLines={2}>{item.title}</Text><Text style={styles.details}>{item.year} • {item.fuel}</Text><Text style={styles.price}>₹ {item.price.toLocaleString('en-IN')}</Text></View>
    </View>
    <View style={styles.locationRow}><Icon name="location-outline" size={15} color={colors.textMuted} /><Text numberOfLines={1} style={styles.location}>{item.location}</Text></View>
    <View style={styles.actions}>{button('Edit', () => openForm(item), styles.action)}{item.status === 'Active' && button('Mark as Sold', () => markSold(item), styles.action)}{button('Delete', () => remove(item), styles.action)}</View>
  </View>;
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}><Text style={styles.heading}>My Sales</Text><Text style={styles.subtitle}>Manage your vehicle listings</Text></View>
      <View style={styles.toolbar}>
        <View style={styles.row}>{['All', 'Active', 'Sold'].map(value => <TouchableOpacity key={value} accessibilityRole="button" accessibilityState={{selected: filter === value}} style={[styles.chip, filter === value && styles.selected]} onPress={() => setFilter(value)}><Text style={[styles.chipText, filter === value && styles.selectedText]}>{value} ({listings.filter(item => value === 'All' || item.status === value).length})</Text></TouchableOpacity>)}</View>
        {button('+ Sell Vehicle', () => openForm(), styles.primary, loading || loadError || saving)}
        <Text style={styles.note}>Saved on this device. Online publishing is not connected yet.</Text>
      </View>
      {loading ? <ActivityIndicator style={styles.flex} size="large" color="#ef4444" /> : loadError ? <View style={styles.empty}><Text style={styles.emptyTitle}>Could not load your listings</Text>{button('Try Again', load)}</View> : <FlatList data={listings.filter(item => filter === 'All' || item.status === filter)} keyExtractor={item => item.id} renderItem={renderListing} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} ListEmptyComponent={<View style={styles.empty}><View style={styles.emptyIcon}><Icon name="car-sport-outline" size={48} color="#ef4444" /></View><Text style={styles.emptyTitle}>{filter === 'All' ? 'No vehicles listed yet' : `No ${filter.toLowerCase()} listings`}</Text><Text style={styles.emptyText}>{filter === 'Sold' ? 'Vehicles you mark as sold will appear here.' : 'Add your vehicle details to create a listing.'}</Text>{filter !== 'Sold' && button('+ Sell Vehicle', () => openForm())}</View>} />}
      <Modal visible={visible} animationType="slide" onRequestClose={() => {if (!saving) {setVisible(false);}}}>
        <SafeAreaView style={styles.container}>
          <View style={styles.formHeader}><Text style={styles.heading}>{editingId ? 'Edit Listing' : 'Sell Vehicle'}</Text>{button('Close', () => setVisible(false), styles.action)}</View>
          <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
              <Text style={styles.label}>Vehicle category</Text><View style={styles.row}>{['2 Wheeler', '4 Wheeler', 'Other'].map(category => <TouchableOpacity key={category} disabled={saving} accessibilityRole="button" accessibilityState={{selected: form.category === category}} style={[styles.chip, form.category === category && styles.selected]} onPress={() => setForm(current => ({...current, category}))}><Text style={[styles.chipText, form.category === category && styles.selectedText]}>{category}</Text></TouchableOpacity>)}</View>
              {field('title', 'Vehicle name *', {placeholder: 'e.g. Maruti Suzuki Swift', maxLength: 80})}
              {field('price', 'Price (₹) *', {placeholder: 'e.g. 650000', keyboardType: 'numeric', maxLength: 12})}
              {field('year', 'Model year *', {placeholder: 'e.g. 2024', keyboardType: 'number-pad', maxLength: 4})}
              {field('fuel', 'Fuel type *', {placeholder: 'e.g. Petrol, Diesel, Electric', maxLength: 30})}
              {field('location', 'Location *', {placeholder: 'City or area', maxLength: 100})}
              {field('image', 'Photo URL (optional)', {placeholder: 'https://...', keyboardType: 'url', autoCapitalize: 'none', autoCorrect: false})}
              {field('description', 'Description (optional)', {placeholder: 'Condition, ownership and other details', multiline: true, maxLength: 1000})}
              {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
              <Text style={styles.note}>This saves the listing on your device only.</Text>
              {button(saving ? 'Saving…' : editingId ? 'Save Changes' : 'Save Listing', save)}
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default MySalesScreen;

const styles = StyleSheet.create({
  flex: {flex: 1}, container: {flex: 1, backgroundColor: colors.background},
  header: {padding: 20, backgroundColor: colors.surface}, heading: {fontSize: 23, fontWeight: '800', color: colors.text}, subtitle: {fontSize: 13, color: colors.textMuted, marginTop: 5},
  toolbar: {padding: 16, gap: 14}, row: {flexDirection: 'row', gap: 10}, chip: {flex: 1, minHeight: 44, paddingVertical: 12, borderRadius: 10, alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border}, selected: {backgroundColor: '#fff1f2', borderColor: '#ef4444'}, chipText: {fontSize: 12, fontWeight: '600', color: colors.textMuted}, selectedText: {color: '#ef4444'},
  primary: {minHeight: 46, paddingHorizontal: 20, borderRadius: 12, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center'}, primaryText: {fontSize: 14, fontWeight: '700', color: '#fff'}, disabled: {opacity: 0.5}, note: {fontSize: 12, color: colors.textMuted, lineHeight: 18},
  list: {paddingHorizontal: 16, paddingBottom: 24, flexGrow: 1}, card: {backgroundColor: colors.surface, padding: 12, borderRadius: 16, marginBottom: 14, elevation: 2}, image: {width: 100, height: 110, borderRadius: 12, backgroundColor: colors.surfaceMuted, resizeMode: 'cover'}, placeholder: {alignItems: 'center', justifyContent: 'center'}, info: {flex: 1}, statusRow: {flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6, justifyContent: 'space-between'}, category: {fontSize: 10, color: colors.textMuted}, badge: {fontSize: 10, fontWeight: '700', color: '#15803d', backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6}, soldBadge: {color: '#475569', backgroundColor: colors.surfaceMuted}, vehicleTitle: {fontSize: 15, fontWeight: '700', color: colors.text, marginTop: 7}, details: {fontSize: 12, color: colors.textMuted, marginTop: 5}, price: {fontSize: 17, fontWeight: '800', color: '#ef4444', marginTop: 7}, locationRow: {flexDirection: 'row', alignItems: 'center', gap: 4, marginVertical: 12}, location: {fontSize: 12, color: colors.textMuted, flex: 1},
  actions: {flexDirection: 'row', flexWrap: 'wrap', borderTopWidth: 1, borderTopColor: colors.border, justifyContent: 'space-between'}, action: {minHeight: 44, justifyContent: 'center', paddingHorizontal: 8}, actionText: {fontSize: 12, fontWeight: '600', color: '#ef4444'},
  empty: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 36, gap: 16}, emptyIcon: {width: 96, height: 96, borderRadius: 48, backgroundColor: '#fff1f2', alignItems: 'center', justifyContent: 'center'}, emptyTitle: {fontSize: 20, fontWeight: '700', color: colors.text, textAlign: 'center'}, emptyText: {fontSize: 14, color: colors.textMuted, lineHeight: 22, textAlign: 'center'},
  formHeader: {paddingHorizontal: 20, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface}, form: {padding: 20, gap: 14}, field: {gap: 7}, label: {fontSize: 13, fontWeight: '600', color: colors.text}, input: {minHeight: 48, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: colors.surface, color: colors.text, fontSize: 14}, multiline: {minHeight: 100, textAlignVertical: 'top'}, error: {fontSize: 13, color: '#dc2626'},
});
