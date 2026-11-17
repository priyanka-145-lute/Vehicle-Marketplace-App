import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import NetworkVehicleImage from '../components/NetworkVehicleImage';
import {useThemeStyles} from '../theme/colors';

const EMPTY_SERVICE = {name: '', description: '', image: ''};
const EMPTY_BUSINESS = {name: '', shortDescription: '', longDescription: '', image: ''};
const SECTIONS = {
  VendorServices: {title: 'Services', icon: 'construct-outline', empty: []},
  VendorImages: {title: 'Images', icon: 'images-outline', empty: []},
  VendorBusinessDetails: {title: 'Business Details', icon: 'storefront-outline', empty: EMPTY_BUSINESS},
};
const MAX_IMAGES = 10;
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const isTextRecord = (record, template) => record && Object.keys(template).every(key => typeof record[key] === 'string');

async function selectImages(limit) {
  const {pick, keepLocalCopy} = require('@react-native-documents/picker');
  const isAndroid = Platform.OS === 'android';
  const type = isAndroid ? 'image/*' : ['public.jpeg', 'public.png', 'org.webmproject.webp'];
  const files = await pick({type, allowMultiSelection: limit > 1});
  if (files.length > limit || files.some(file =>
    !file.hasRequestedType || (isAndroid && !PHOTO_TYPES.includes(file.type)) || !file.size || file.size > 5 * 1024 * 1024
  )) {
    throw new Error(`Choose up to ${limit} JPG, PNG or WebP images, up to 5 MB each.`);
  }
  const prefix = `vendor-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  // shortcut: removing a saved image unlinks it from the form, until local file cleanup is available.
  const copies = await keepLocalCopy({
    destination: 'documentDirectory',
    files: files.map((file, index) => ({
      uri: file.uri,
      fileName: `${prefix}-${index}${file.name?.match(/\.(jpe?g|png|webp)$/i)?.[0] || ''}`,
    })),
  });
  return {images: copies.filter(copy => copy.status === 'success').map(copy => copy.localUri), requested: files.length};
}

export default function VendorSetup({route, navigation, accountId, Page, Button}) {
  const {colors, styles} = useThemeStyles(createStyles);
  const section = SECTIONS[route.name];
  const storageKey = section && accountId ? `vehicle-vendor-setup:${accountId}:${route.name}` : null;
  const [data, setData] = useState(undefined);
  const [loadFailed, setLoadFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [service, setService] = useState(null);
  const working = useRef(false);
  const isImages = route.name === 'VendorImages';
  const isServices = route.name === 'VendorServices';

  useEffect(() => {
    if (!storageKey) {return;}
    let active = true;
    AsyncStorage.getItem(storageKey).then(raw => {
      const value = raw === null ? section.empty : JSON.parse(raw);
      const valid = isImages ? Array.isArray(value) && value.every(uri => typeof uri === 'string')
        : isServices ? Array.isArray(value) && value.every(row => isTextRecord(row, EMPTY_SERVICE))
        : isTextRecord(value, EMPTY_BUSINESS);
      if (!valid) {throw new Error('Invalid vendor setup');}
      if (active) {setData(value);}
    }).catch(() => {if (active) {setLoadFailed(true);}});
    return () => {active = false;};
  }, [storageKey, section, isImages, isServices, retry]);

  const run = async (action, failureMessage) => {
    if (working.current) {return;}
    working.current = true;
    setBusy(true);
    setError('');
    try {await action();} catch (failure) {
      if (failure?.code !== 'OPERATION_CANCELED') {setError(failureMessage || failure.message || 'Please try again.');}
    } finally {
      working.current = false;
      setBusy(false);
    }
  };
  const save = (next, onSaved) => run(async () => {
    await AsyncStorage.setItem(storageKey, JSON.stringify(next));
    setData(next);
    onSaved();
  }, 'Could not save your changes. Please try again.');
  const addImages = (limit, update) => run(async () => {
    const {images, requested} = await selectImages(limit);
    if (images.length) {update(images);}
    if (images.length < requested) {setError('Some images could not be added. Select them again.');}
  });

  const field = (label, value, onChangeText, options) => <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TextInput accessibilityLabel={label} style={[styles.input, options?.multiline && styles.multiline]} placeholderTextColor={colors.textMuted} value={value} onChangeText={onChangeText} editable={!busy} {...options} />
  </View>;
  const outline = (label, icon, onPress, disabled = busy, style) => (
    <TouchableOpacity accessibilityRole="button" disabled={disabled} onPress={onPress} style={[styles.outline, style, disabled && styles.disabled]}>
      {icon && <Icon name={icon} size={20} color={colors.text} />}<Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
  const image = (uri, style) => <NetworkVehicleImage uri={uri} fallbackUri={uri} style={style} />;
  const imageField = (uri, label, update) => (
    <View style={styles.field}>
      {uri ? image(uri, styles.banner) : null}
      {outline(uri ? `Change ${label}` : `Add ${label}`, 'image-outline', () => addImages(1, ([next]) => update(next)), busy, !uri && styles.tallPicker)}
      {uri ? outline(`Remove ${label}`, 'trash-outline', () => update('')) : null}
    </View>
  );
  const saveService = () => {
    const name = service.name.trim();
    if (!name) {setError('Enter a service name.'); return;}
    const row = {name, description: service.description.trim(), image: service.image};
    save(service.index === data.length ? [...data, row] : data.map((item, index) => index === service.index ? row : item), () => setService(null));
  };

  return <Page title={section?.title || 'Business Setup'} navigation={navigation}>
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {!section ? <>
          <View style={styles.card}>
            {Object.entries(SECTIONS).map(([name, item]) => <TouchableOpacity key={name} accessibilityRole="button" accessibilityLabel={`Add ${item.title}`} onPress={() => navigation.navigate(name)} style={styles.menuRow}>
              <View style={styles.menuIcon}><Icon name={item.icon} size={22} color={colors.text} /></View>
              <Text style={[styles.label, styles.flex]}>Add {item.title}</Text>
              <Icon name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>)}
          </View>
          <Text style={styles.note}>Business setup is saved on this device.</Text>
        </> : !storageKey ? <Text accessibilityRole="alert" style={styles.error}>Could not identify your account.</Text>
          : loadFailed ? <>
            <Text accessibilityRole="alert" style={styles.error}>Could not load {section.title.toLowerCase()}.</Text>
            <Button title="Try Again" onPress={() => {setLoadFailed(false); setRetry(value => value + 1);}} />
          </> : data === undefined ? <ActivityIndicator accessibilityLabel={`Loading ${section.title.toLowerCase()}`} color="#ef4444" />
          : isImages ? <>
            {!data.length && <Text style={styles.note}>No images added yet.</Text>}
            <View style={styles.grid}>
              {data.map((uri, index) => <View key={uri} style={styles.tile}>
                {image(uri, styles.tileImage)}
                <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Remove image ${index + 1}`} disabled={busy} onPress={() => setData(current => current.filter(item => item !== uri))} style={styles.removeImage}>
                  <Icon name="close" size={17} color="#b91c1c" />
                </TouchableOpacity>
              </View>)}
            </View>
            {outline('Add image', 'add-outline', () => addImages(MAX_IMAGES - data.length, images => setData(current => [...current, ...images])), busy || data.length >= MAX_IMAGES)}
            <Button title="Save Images" disabled={busy} onPress={() => save(data, navigation.goBack)} />
          </> : isServices ? <>
            {!data.length && !service && <Text style={styles.note}>No services added yet.</Text>}
            {data.map((item, index) => <View key={index} style={[styles.card, styles.serviceRow]}>
              {item.image ? image(item.image, styles.serviceImage) : null}
              <View style={styles.flex}><Text style={styles.label}>{item.name}</Text><Text style={styles.note}>{item.description}</Text></View>
              <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Edit ${item.name}`} disabled={busy} style={styles.iconButton} onPress={() => {setError(''); setService({...item, index});}}><Icon name="create-outline" size={20} color={colors.text} /></TouchableOpacity>
              <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Remove ${item.name}`} disabled={busy || Boolean(service)} style={styles.iconButton} onPress={() => save(data.filter((_, position) => position !== index), () => {})}><Icon name="trash-outline" size={20} color={colors.text} /></TouchableOpacity>
            </View>)}
            {service ? <View style={[styles.card, styles.form]}>
              {imageField(service.image, 'service image', uri => setService(current => ({...current, image: uri})))}
              {field('Service name', service.name, name => setService(current => ({...current, name})), {maxLength: 80})}
              {field('Short description', service.description, description => setService(current => ({...current, description})), {multiline: true, maxLength: 120})}
              <Button title={service.index === data.length ? 'Save Service' : 'Save Changes'} disabled={busy} onPress={saveService} />
              {outline('Cancel', null, () => {setError(''); setService(null);})}
            </View> : outline('Add service', 'add-outline', () => {setError(''); setService({...EMPTY_SERVICE, index: data.length});})}
          </> : <>
            <View style={[styles.card, styles.form]}>
              {imageField(data.image, 'banner image', uri => setData(current => ({...current, image: uri})))}
              {field('Business name', data.name, name => setData(current => ({...current, name})), {maxLength: 80})}
              {field('Short description', data.shortDescription, shortDescription => setData(current => ({...current, shortDescription})), {multiline: true, maxLength: 120})}
              {field('Long description', data.longDescription, longDescription => setData(current => ({...current, longDescription})), {multiline: true, maxLength: 1000})}
            </View>
            <Button title="Save Business Details" disabled={busy} onPress={() => {
              const name = data.name.trim();
              if (!name) {setError('Enter a business name.'); return;}
              save({...data, name, shortDescription: data.shortDescription.trim(), longDescription: data.longDescription.trim()}, navigation.goBack);
            }} />
          </>}
        {busy && <ActivityIndicator accessibilityLabel="Working" color="#ef4444" />}
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      </ScrollView>
    </KeyboardAvoidingView>
  </Page>;
}

const createStyles = colors => StyleSheet.create({
  flex: {flex: 1},
  content: {padding: 16, paddingBottom: 28, gap: 14, width: '100%', maxWidth: 640, alignSelf: 'center'},
  card: {borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, overflow: 'hidden'},
  menuRow: {minHeight: 66, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border},
  menuIcon: {width: 40, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accentSurface, borderRadius: 12},
  form: {padding: 14, gap: 12},
  field: {gap: 6},
  label: {fontSize: 15, fontWeight: '700', color: colors.text},
  note: {fontSize: 13, color: colors.textMuted},
  error: {fontSize: 13, color: colors.text, backgroundColor: colors.accentSurface, padding: 10, borderRadius: 10},
  input: {minHeight: 46, borderColor: colors.border, borderWidth: 1, borderRadius: 10, backgroundColor: colors.surfaceMuted, color: colors.text, paddingHorizontal: 12, paddingVertical: 8},
  multiline: {minHeight: 76, textAlignVertical: 'top'},
  outline: {minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, borderRadius: 10, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.textMuted, backgroundColor: colors.accentSurface},
  disabled: {opacity: 0.5},
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  tile: {width: '48%', aspectRatio: 1.5, borderRadius: 12, overflow: 'hidden', backgroundColor: colors.surfaceMuted},
  tileImage: {width: '100%', height: '100%', resizeMode: 'cover'},
  removeImage: {position: 'absolute', top: 4, right: 4, width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center'},
  banner: {width: '100%', height: 190, borderRadius: 12, resizeMode: 'cover'},
  tallPicker: {minHeight: 132},
  serviceRow: {flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10},
  serviceImage: {width: 54, height: 54, borderRadius: 8},
  iconButton: {width: 44, height: 44, justifyContent: 'center', alignItems: 'center'},
});
