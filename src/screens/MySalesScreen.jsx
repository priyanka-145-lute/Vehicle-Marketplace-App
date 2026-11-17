import {useThemeStyles} from '../theme/colors';
import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Modal, Platform, ScrollView, Switch, Text, TextInput, TouchableOpacity, View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import NetworkVehicleImage from '../components/NetworkVehicleImage';
import LocationFields from '../components/LocationFields';
import BrandDropdown from '../components/BrandDropdown';
import VehicleTypeDropdown from '../components/VehicleTypeDropdown';
import VehicleCategoryDropdown from '../components/VehicleCategoryDropdown';

const STORAGE_KEY = 'vehicle-my-sales';
const EMPTY = {
  category: '4 Wheeler', model: '', variant: '', year: '', registrationYear: '', registrationNumber: '',
  fuel: '', transmission: '', ownership: '', kilometres: '', engineCapacity: '', seatingCapacity: '',
  image: '', photos: [], title: '', price: '', negotiable: false, description: '',
  ownerName: '', ownerMobile: '', location: '', addressLine1: '', addressLine2: '', pincode: '',
};
const YEAR = /^\d{4}$/;
const PHOTO_URL = /^https?:\/\/\S+$/i;
const MAX_PHOTOS = 10;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const PHOTO_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const MySalesScreen = () => {
  const {colors, styles} = useThemeStyles(createStyles);

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const busy = useRef(false);
  const [filter, setFilter] = useState('All');
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [visible, setVisible] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [error, setError] = useState('');
  const [pickingPhotos, setPickingPhotos] = useState(false);

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
    setCategoryOpen(false);
    setBrandOpen(false);
    setTypeOpen(false);
    setEditingId(item?.id || null);
    setForm(item ? {...EMPTY, pincode: item.locationDetails?.pincode || '', ...item, price: String(item.price)} : {...EMPTY});
    setError('');
    setVisible(true);
  };
  const selectVehicleType = type => {
    setBrandOpen(false);
    setCategoryOpen(false);
    setForm(current => ({
      ...current,
      VEHICLETYPEID: type?.VEHICLETYPEID ?? null,
      VEHICLETYPENAME: type?.VEHICLETYPENAME || '',
      VEHICLETYPECODE: type?.VEHICLETYPECODE || '',
      ...(current.VEHICLETYPEID !== type?.VEHICLETYPEID ? {BrandName: '', VehicleBrandId: null, VehicleCategoryId: null, CATEGORYNAME: '', CATEGORYCODE: '', ParentCategoryID: null, CategoryLevel: null, model: '', variant: ''} : {}),
    }));
  };
  const addPhotos = async () => {
    setPickingPhotos(true);
    setError('');
    try {
      const {pick, keepLocalCopy} = require('@react-native-documents/picker');
      // Android gallery apps match a single image MIME filter when opening the picker.
      const isAndroid = Platform.OS === 'android';
      const type = isAndroid ? 'image/*' : ['public.jpeg', 'public.png', 'org.webmproject.webp'];
      const files = await pick({type, allowMultiSelection: true});
      if (files.length + form.photos.length > MAX_PHOTOS || files.some(file =>
        !file.hasRequestedType || (isAndroid && !PHOTO_MIME_TYPES.includes(file.type)) || !file.size || file.size > MAX_PHOTO_BYTES
      )) {
        Alert.alert('Check your photos', 'Choose up to 10 JPG, PNG or WebP photos, up to 5 MB each.');
        return;
      }
      const prefix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      // shortcut: copied photos stay in app storage after removal, until the listing store can delete files.
      const copies = await keepLocalCopy({
        destination: 'documentDirectory',
        files: files.map((file, index) => {
          const extension = file.name?.match(/\.(jpe?g|png|webp)$/i)?.[0] || '';
          return {uri: file.uri, fileName: `listing-${prefix}-${index}${extension}`};
        }),
      });
      const photos = copies.filter(copy => copy.status === 'success').map(copy => copy.localUri);
      setForm(current => ({...current, photos: [...current.photos, ...photos]}));
      if (photos.length !== files.length) {
        Alert.alert('Could not add every photo', 'Try selecting the missing photos again.');
      }
    } catch (pickerError) {
      if (pickerError?.code !== 'OPERATION_CANCELED') {
        Alert.alert('Could not add photos', 'Please try again.');
      }
    } finally {
      setPickingPhotos(false);
    }
  };
  const save = async () => {
    if (pickingPhotos || busy.current) {return;}
    const price = Number(form.price.replace(/,/g, ''));
    if (form.locationDetails?.countryId && !form.locationDetails.cityId) {setError('Please select a state and city.'); return;}
    if (!form.title.trim() || !form.location.trim() || !form.fuel.trim()) {setError('Enter a listing title, fuel type and location.'); return;}
    if (!Number.isFinite(price) || price <= 0) {setError('Enter a valid price greater than zero.'); return;}
    if (!YEAR.test(form.year) || Number(form.year) < 1900 || Number(form.year) > new Date().getFullYear() + 1) {setError('Enter a valid four-digit manufacturing year.'); return;}
    if (form.registrationYear && (!YEAR.test(form.registrationYear) || Number(form.registrationYear) < Number(form.year) || Number(form.registrationYear) > new Date().getFullYear() + 1)) {setError('Enter a valid registration year on or after the manufacturing year.'); return;}
    if ([form.kilometres, form.engineCapacity, form.seatingCapacity].some(value => value && !/^\d+$/.test(value))) {setError('Enter whole numbers for kilometres, engine capacity and seats.'); return;}
    if (form.ownerMobile && (!/^\+?[\d ()-]+$/.test(form.ownerMobile) || !/^\d{7,15}$/.test(form.ownerMobile.replace(/\D/g, '')))) {setError('Enter a valid owner mobile number.'); return;}
    if (form.image.trim() && !PHOTO_URL.test(form.image.trim())) {setError('Enter a valid photo URL starting with https:// or http://.'); return;}
    const previous = listings.find(item => item.id === editingId);
    const item = {...form, title: form.title.trim(), fuel: form.fuel.trim(), location: form.location.trim(), image: form.image.trim(), description: form.description.trim(), price, id: editingId || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, status: previous?.status || 'Active'};
    if (await persist(editingId ? listings.map(saved => saved.id === editingId ? item : saved) : [item, ...listings])) {setVisible(false); setFilter('All');}
  };
  const remove = item => Alert.alert('Delete listing?', `Remove ${item.title} from My Sales?`, [{text: 'Cancel', style: 'cancel'}, {text: 'Delete', style: 'destructive', onPress: () => persist(listings.filter(saved => saved.id !== item.id))}]);
  const markSold = item => Alert.alert('Mark as sold?', `${item.title} will move to Sold.`, [{text: 'Cancel', style: 'cancel'}, {text: 'Mark as Sold', onPress: () => persist(listings.map(saved => saved.id === item.id ? {...saved, status: 'Sold'} : saved))}]);
  const button = (label, onPress, style = styles.primary, disabled = saving) => <TouchableOpacity accessibilityRole="button" disabled={disabled} onPress={onPress} style={[style, disabled && styles.disabled]}><Text style={style === styles.primary || style === styles.formSave ? styles.primaryText : styles.actionText}>{label}</Text></TouchableOpacity>;
  const field = (key, label, options = {}, paired = false) => <View style={[styles.field, paired && styles.pairedField]} key={key}><Text style={styles.label}>{label}</Text><TextInput accessibilityLabel={label} style={[styles.input, options.multiline && styles.multiline]} value={form[key]} onChangeText={value => setForm(current => ({...current, [key]: value}))} editable={!saving} placeholderTextColor={colors.textMuted} {...options} /></View>;
  const section = (title, icon, children) => (
    <View style={styles.formSection}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}><Icon name={icon} size={20} color={styles.accent.color} /></View>
        <Text accessibilityRole="header" style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
  const renderListing = ({item}) => {
    const photo = item.photos?.[0] || item.image;
    return <View style={styles.card}>
      <View style={styles.row}>
        {photo ? <NetworkVehicleImage uri={photo} fallbackUri={photo} style={styles.image} /> : <View style={[styles.image, styles.placeholder]}><Icon name="car-sport-outline" size={36} color={colors.textMuted} /></View>}
        <View style={styles.info}><View style={styles.statusRow}><Text style={styles.category}>{item.category}</Text><Text style={[styles.badge, item.status === 'Sold' && styles.soldBadge]}>{item.status}</Text></View><Text style={styles.vehicleTitle} numberOfLines={2}>{item.title}</Text><Text style={styles.details}>{item.year} • {item.fuel}</Text><Text style={styles.price}>₹ {item.price.toLocaleString('en-IN')}</Text></View>
      </View>
      <View style={styles.locationRow}><Icon name="location-outline" size={15} color={colors.textMuted} /><Text numberOfLines={1} style={styles.location}>{item.location}</Text></View>
      <View style={styles.actions}>{button('Edit', () => openForm(item), styles.action)}{item.status === 'Active' && button('Mark as Sold', () => markSold(item), styles.action)}{button('Delete', () => remove(item), styles.action)}</View>
    </View>;
  };
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}><Text style={styles.heading}>My Sales</Text><Text style={styles.subtitle}>Manage your vehicle listings</Text></View>
      <View style={styles.toolbar}>
        <View style={styles.row}>{['All', 'Active', 'Sold'].map(value => <TouchableOpacity key={value} accessibilityRole="button" accessibilityState={{selected: filter === value}} style={[styles.chip, filter === value && styles.selected]} onPress={() => setFilter(value)}><Text style={[styles.chipText, filter === value && styles.selectedText]}>{value} ({listings.filter(item => value === 'All' || item.status === value).length})</Text></TouchableOpacity>)}</View>
        {button('+ Sell Vehicle', () => openForm(), styles.primary, loading || loadError || saving)}
        <Text style={styles.note}>Saved on this device. Online publishing is not connected yet.</Text>
      </View>
      {loading ? <ActivityIndicator style={styles.flex} size="large" color="#ef4444" /> : loadError ? <View style={styles.empty}><Text style={styles.emptyTitle}>Could not load your listings</Text>{button('Try Again', load)}</View> : <FlatList data={listings.filter(item => filter === 'All' || item.status === filter)} keyExtractor={item => item.id} renderItem={renderListing} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} ListEmptyComponent={<View style={styles.empty}><View style={styles.emptyIcon}><Icon name="car-sport-outline" size={48} color="#ef4444" /></View><Text style={styles.emptyTitle}>{filter === 'All' ? 'No vehicles listed yet' : `No ${filter.toLowerCase()} listings`}</Text><Text style={styles.emptyText}>{filter === 'Sold' ? 'Vehicles you mark as sold will appear here.' : 'Add your vehicle details to create a listing.'}</Text>{filter !== 'Sold' && button('+ Sell Vehicle', () => openForm())}</View>} />}
      <Modal visible={visible} animationType="slide" onRequestClose={() => {if (!saving && !pickingPhotos) {setVisible(false);}}}>
        <SafeAreaView style={styles.container}>
          <View style={styles.formHeader}>
            <Text accessibilityRole="header" style={styles.formTitle}>{editingId ? 'Edit Listing' : 'Sell Vehicle'}</Text>
            {button('Close', () => setVisible(false), styles.closeButton, saving || pickingPhotos)}
          </View>
          <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
              {section('Vehicle Identity', 'car-outline', <>
                <Text style={styles.label}>Vehicle category</Text><View style={styles.row}>{['2 Wheeler', '4 Wheeler', 'Other'].map(category => <TouchableOpacity key={category} disabled={saving} accessibilityRole="button" accessibilityState={{selected: form.category === category}} style={[styles.chip, form.category === category && styles.selected]} onPress={() => {setBrandOpen(false); setTypeOpen(false); setCategoryOpen(false); setForm(current => current.category === category ? current : {...current, category, BrandName: '', VehicleBrandId: null, VEHICLETYPEID: null, VEHICLETYPENAME: '', VEHICLETYPECODE: '', VehicleCategoryId: null, CATEGORYNAME: '', CATEGORYCODE: '', ParentCategoryID: null, CategoryLevel: null});}}><Text style={[styles.chipText, form.category === category && styles.selectedText]}>{category}</Text></TouchableOpacity>)}</View>
                <Text style={styles.label}>Vehicle Type</Text>{visible && <VehicleTypeDropdown category={form.category} value={form} disabled={saving} open={typeOpen} onOpenChange={open => {setTypeOpen(open); setBrandOpen(false); setCategoryOpen(false);}} onChange={selectVehicleType} />}
                <Text style={styles.label}>Vehicle Category</Text>{visible && <VehicleCategoryDropdown vehicleTypeId={form.VEHICLETYPEID} value={form} disabled={saving} open={categoryOpen} onOpenChange={open => {setCategoryOpen(open); setTypeOpen(false); setBrandOpen(false);}} onChange={item => setForm(current => ({...current, VehicleCategoryId: item?.VehicleCategoryId ?? null, CATEGORYNAME: item?.CATEGORYNAME || '', CATEGORYCODE: item?.CATEGORYCODE || '', ParentCategoryID: item?.ParentCategoryID ?? null, CategoryLevel: item?.CategoryLevel ?? null}))} />}
                <Text style={styles.label}>Brand</Text>{visible && <BrandDropdown vehicleTypeId={form.VEHICLETYPEID} value={form} disabled={saving || !form.VEHICLETYPEID} open={brandOpen} onOpenChange={open => {setBrandOpen(open); setTypeOpen(false); setCategoryOpen(false);}} onChange={brand => setForm(current => ({...current, BrandName: brand?.BrandName || '', VehicleBrandId: brand?.VehicleBrandId ?? null}))} />}
                <View style={styles.fieldPair}>
                  {field('model', 'Model', {placeholder: 'e.g. Swift', maxLength: 80}, true)}
                  {field('variant', 'Variant', {placeholder: 'e.g. VXi', maxLength: 80}, true)}
                </View>
                <View style={styles.fieldPair}>
                  {field('year', 'Manufacturing year *', {placeholder: 'e.g. 2024', keyboardType: 'number-pad', maxLength: 4}, true)}
                  {field('registrationYear', 'Registration year', {placeholder: 'e.g. 2025', keyboardType: 'number-pad', maxLength: 4}, true)}
                </View>
                {field('registrationNumber', 'Registration number', {placeholder: 'e.g. MH31AB1234', autoCapitalize: 'characters', maxLength: 20})}
              </>)}

              {section('Specifications', 'speedometer-outline', <>
                {field('fuel', 'Fuel type *', {placeholder: 'e.g. Petrol, Diesel, Electric', maxLength: 30})}
                {field('transmission', 'Transmission', {placeholder: 'e.g. Manual or Automatic', maxLength: 30})}
                {field('ownership', 'Ownership', {placeholder: 'e.g. First owner', maxLength: 30})}
                {field('kilometres', 'Kilometres driven', {placeholder: 'e.g. 35000', keyboardType: 'number-pad', maxLength: 9})}
                <View style={styles.fieldPair}>
                  {field('engineCapacity', 'Engine capacity (CC)', {placeholder: 'e.g. 1197', keyboardType: 'number-pad', maxLength: 6}, true)}
                  {field('seatingCapacity', 'Seating capacity', {placeholder: 'e.g. 5', keyboardType: 'number-pad', maxLength: 3}, true)}
                </View>
              </>)}

              {section('Photos', 'images-outline', <>
                <TouchableOpacity
                  accessibilityRole="button"
                  disabled={pickingPhotos || saving || form.photos.length >= MAX_PHOTOS}
                  onPress={addPhotos}
                  style={[styles.photoPicker, (pickingPhotos || saving || form.photos.length >= MAX_PHOTOS) && styles.disabled]}>
                  <Icon name="cloud-upload-outline" size={26} color={styles.accent.color} />
                  <Text style={styles.photoPickerTitle}>{pickingPhotos ? 'Adding photos…' : 'Choose vehicle photos'}</Text>
                  <Text style={styles.photoHint}>JPG, PNG or WebP · 5 MB each · {form.photos.length}/{MAX_PHOTOS} photos</Text>
                </TouchableOpacity>
                {form.photos.length > 0 && <ScrollView horizontal contentContainerStyle={styles.photoStrip} keyboardShouldPersistTaps="handled">
                  {form.photos.map((uri, index) => <View key={uri} style={styles.photoTile}>
                    <NetworkVehicleImage uri={uri} fallbackUri={uri} style={styles.thumbnail} />
                    {button(`Remove photo ${index + 1}`, () => setForm(current => ({...current, photos: current.photos.filter(photo => photo !== uri)})), styles.photoRemove, saving || pickingPhotos)}
                  </View>)}
                </ScrollView>}
                {listings.find(item => item.id === editingId)?.image ? field('image', 'Existing photo URL', {keyboardType: 'url', autoCapitalize: 'none', autoCorrect: false}) : null}
                {PHOTO_URL.test(form.image.trim()) && <NetworkVehicleImage uri={form.image.trim()} fallbackUri={form.image.trim()} style={styles.thumbnail} />}
              </>)}

              {section('Price & Description', 'pricetag-outline', <>
                {field('title', 'Listing title *', {placeholder: 'e.g. 2024 Maruti Suzuki Swift', maxLength: 80})}
                {field('price', 'Expected price (₹) *', {placeholder: 'e.g. 650000', keyboardType: 'numeric', maxLength: 12})}
                <View style={styles.switchRow}>
                  <Text style={styles.label}>Price is negotiable</Text>
                  <Switch accessibilityLabel="Price is negotiable" value={form.negotiable} disabled={saving} trackColor={{true: '#b91c1c'}} onValueChange={negotiable => setForm(current => ({...current, negotiable}))} />
                </View>
                {field('description', 'Description (optional)', {placeholder: 'Condition, service history and other details', multiline: true, maxLength: 1000})}
              </>)}

              {section('Owner & Location', 'location-outline', <>
                {field('ownerName', 'Owner name', {autoCapitalize: 'words', maxLength: 80})}
                {field('ownerMobile', 'Owner mobile number', {keyboardType: 'phone-pad', maxLength: 20})}
                {!form.locationDetails?.countryId && form.location ? <Text style={styles.note}>Saved location: {form.location}</Text> : null}
                {visible && <LocationFields value={form.locationDetails} disabled={saving} onChange={locationDetails => {setForm(current => ({...current, locationDetails, location: [locationDetails.areaName, locationDetails.cityName, locationDetails.stateName].filter(Boolean).join(', '), pincode: locationDetails.pincode || ''})); setError('');}} />}
                {field('addressLine1', 'Address line 1', {maxLength: 150})}
                {field('addressLine2', 'Address line 2', {maxLength: 150})}
                {field('pincode', 'Pincode', {maxLength: 12})}
              </>)}
            </ScrollView>
            <View style={styles.formFooter}>
              {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
              <Text style={styles.footerNote}>This saves the listing on your device only.</Text>
              {button(saving ? 'Saving…' : editingId ? 'Save Changes' : 'Save Listing', save, styles.formSave, saving || pickingPhotos)}
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default MySalesScreen;

const createStyles = colors => StyleSheet.create({
  accent: {color: colors.background === '#111827' ? '#fda4af' : '#b91c1c'},
  formSection: {gap: 13, padding: 16, borderWidth: 1, borderColor: colors.border, borderRadius: 18, backgroundColor: colors.surface},
  sectionHeader: {flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 3},
  sectionIcon: {width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: colors.accentSurface},
  sectionTitle: {flex: 1, fontSize: 18, fontWeight: '800', color: colors.text},
  fieldPair: {flexDirection: 'row', flexWrap: 'wrap', gap: 12},
  pairedField: {flexGrow: 1, flexBasis: 122, justifyContent: 'space-between'},
  switchRow: {minHeight: 50, paddingHorizontal: 12, borderRadius: 12, backgroundColor: colors.surfaceMuted, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8},
  photoPicker: {alignItems: 'center', gap: 7, padding: 18, borderWidth: 1, borderStyle: 'dashed', borderColor: '#e11d48', borderRadius: 14, backgroundColor: colors.accentSurface},
  photoPickerTitle: {fontSize: 15, fontWeight: '700', color: colors.text, textAlign: 'center'},
  photoHint: {fontSize: 12, color: colors.textMuted, textAlign: 'center'},
  photoStrip: {gap: 10},
  photoTile: {width: 116, borderWidth: 1, borderColor: colors.border, borderRadius: 12, overflow: 'hidden'},
  thumbnail: {width: '100%', maxWidth: 116, height: 84, backgroundColor: colors.surfaceMuted, resizeMode: 'cover'},
  photoRemove: {minHeight: 44, paddingHorizontal: 6, justifyContent: 'center', alignItems: 'center'},
  flex: {flex: 1}, container: {flex: 1, backgroundColor: colors.background},
  header: {padding: 20, backgroundColor: colors.surface}, heading: {fontSize: 23, fontWeight: '800', color: colors.text}, subtitle: {fontSize: 13, color: colors.textMuted, marginTop: 5},
  toolbar: {padding: 16, gap: 14}, row: {flexDirection: 'row', gap: 10}, chip: {flex: 1, minHeight: 44, paddingVertical: 12, borderRadius: 10, alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border}, selected: {backgroundColor: colors.accentSurface, borderColor: '#ef4444'}, chipText: {fontSize: 12, fontWeight: '600', color: colors.textMuted}, selectedText: {color: '#ef4444'},
  primary: {minHeight: 46, paddingHorizontal: 20, borderRadius: 12, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center'}, primaryText: {fontSize: 14, fontWeight: '700', color: '#fff'}, disabled: {opacity: 0.5}, note: {fontSize: 12, color: colors.textMuted, lineHeight: 18},
  list: {paddingHorizontal: 16, paddingBottom: 24, flexGrow: 1}, card: {backgroundColor: colors.surface, padding: 12, borderRadius: 16, marginBottom: 14, elevation: 2}, image: {width: 100, height: 110, borderRadius: 12, backgroundColor: colors.surfaceMuted, resizeMode: 'cover'}, placeholder: {alignItems: 'center', justifyContent: 'center'}, info: {flex: 1}, statusRow: {flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6, justifyContent: 'space-between'}, category: {fontSize: 10, color: colors.textMuted}, badge: {fontSize: 10, fontWeight: '700', color: '#15803d', backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6}, soldBadge: {color: colors.textMuted, backgroundColor: colors.surfaceMuted}, vehicleTitle: {fontSize: 15, fontWeight: '700', color: colors.text, marginTop: 7}, details: {fontSize: 12, color: colors.textMuted, marginTop: 5}, price: {fontSize: 17, fontWeight: '800', color: '#ef4444', marginTop: 7}, locationRow: {flexDirection: 'row', alignItems: 'center', gap: 4, marginVertical: 12}, location: {fontSize: 12, color: colors.textMuted, flex: 1},
  actions: {flexDirection: 'row', flexWrap: 'wrap', borderTopWidth: 1, borderTopColor: colors.border, justifyContent: 'space-between'}, action: {minHeight: 44, justifyContent: 'center', paddingHorizontal: 8}, actionText: {fontSize: 12, fontWeight: '600', color: '#ef4444'},
  empty: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 36, gap: 16}, emptyIcon: {width: 96, height: 96, borderRadius: 48, backgroundColor: colors.accentSurface, alignItems: 'center', justifyContent: 'center'}, emptyTitle: {fontSize: 20, fontWeight: '700', color: colors.text, textAlign: 'center'}, emptyText: {fontSize: 14, color: colors.textMuted, lineHeight: 22, textAlign: 'center'},
  formHeader: {paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border},
  formTitle: {flex: 1, fontSize: 23, fontWeight: '800', color: colors.text},
  closeButton: {minHeight: 44, minWidth: 64, paddingHorizontal: 12, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: colors.accentSurface},
  form: {width: '100%', maxWidth: 640, alignSelf: 'center', padding: 14, gap: 14},
  field: {gap: 7},
  label: {fontSize: 13, fontWeight: '600', color: colors.text},
  input: {minHeight: 50, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, backgroundColor: colors.surfaceMuted, color: colors.text, fontSize: 14},
  multiline: {minHeight: 110, textAlignVertical: 'top'},
  formFooter: {paddingHorizontal: 16, paddingVertical: 10, gap: 6, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
  footerNote: {fontSize: 12, color: colors.textMuted, textAlign: 'center'},
  formSave: {width: '100%', maxWidth: 612, alignSelf: 'center', minHeight: 50, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, backgroundColor: '#b91c1c', alignItems: 'center', justifyContent: 'center'},
  error: {fontSize: 13, color: colors.background === '#111827' ? '#fda4af' : '#b91c1c', textAlign: 'center'},
});
