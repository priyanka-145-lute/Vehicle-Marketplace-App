import {useThemeStyles} from '../theme/colors';
import React, {useEffect, useState} from 'react';
import {Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import VehicleTypeDropdown from './VehicleTypeDropdown';
import BrandDropdown from './BrandDropdown';

const MIN_PRICE = 50000;
const MAX_PRICE = 10000000;
export const OTHER_FILTER_DEFAULTS = {minPrice: MIN_PRICE, maxPrice: MAX_PRICE, type: 'All', fuel: 'All', yearFrom: 'Any Year', yearTo: 'Any Year', brand: 'All Brands', model: 'All Models'};

const Chip = ({label, active, onPress}) => {
  const {styles} = useThemeStyles(createStyles);
  return (<TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress}><Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text></TouchableOpacity>);
};
const Dropdown = ({name, value, options, opened, setOpened, onSelect}) => {
  const {colors, styles} = useThemeStyles(createStyles);
const open = opened === name; return <View><TouchableOpacity style={[styles.dropdown, open && styles.dropdownActive]} onPress={() => setOpened(open ? null : name)}><Text style={styles.dropdownText}>{value}</Text><Icon name={open ? 'chevron-up' : 'chevron-down'} size={14} color={colors.textMuted} /></TouchableOpacity>{open ? <View style={styles.options}>{options.map(option => <TouchableOpacity key={option} style={styles.option} onPress={() => {onSelect(option); setOpened(null);}}><Text style={[styles.optionText, value === option && styles.optionSelected]}>{option}</Text>{value === option ? <Icon name="checkmark" size={15} color="#ff1838" /> : null}</TouchableOpacity>)}</View> : null}</View>;};

const PriceSlider = ({min, max, onChange}) => {
  const {styles} = useThemeStyles(createStyles);

  const [width, setWidth] = useState(1);
  const minPos = ((min - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
  const maxPos = ((max - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
  const move = event => {const ratio = Math.max(0, Math.min(1, event.nativeEvent.locationX / width)); const value = Math.round((MIN_PRICE + ratio * (MAX_PRICE - MIN_PRICE)) / 50000) * 50000; if (Math.abs(value - min) <= Math.abs(value - max)) onChange(Math.min(value, max - 50000), max); else onChange(min, Math.max(value, min + 50000));};
  return <View style={styles.slider} onLayout={event => setWidth(event.nativeEvent.layout.width)} onStartShouldSetResponder={() => true} onMoveShouldSetResponder={() => true} onResponderGrant={move} onResponderMove={move}><View style={styles.track} /><View style={[styles.fill, {left: `${minPos}%`, right: `${100 - maxPos}%`}]} /><View style={[styles.knob, {left: `${minPos}%`}]} /><View style={[styles.knob, {left: `${maxPos}%`}]} /></View>;
};

const OtherVehicleFilterDrawer = ({visible, filters, onClose, onApply}) => {
  const {colors, styles} = useThemeStyles(createStyles);

  const [draft, setDraft] = useState(filters); const [opened, setOpened] = useState(null);
  useEffect(() => {if (visible) {setDraft(filters); setOpened(null);}}, [filters, visible]);
  const update = (key, value) => setDraft(current => ({...current, [key]: value}));
  const years = ['Any Year', '2026', '2025', '2024', '2023', '2022', '2021', '2020'];
  const models = ['All Models', 'Starbus', 'RE Auto', 'Dost+', 'Pro 3016', '407 Gold', 'Traveller', '3DX Plus', '744 FE', 'Hydra 12XW', 'RX 20'];
  return <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}><View style={styles.root}><View style={styles.panel}>
    <View style={styles.header}><View><Text style={styles.title}>Filters</Text><Text style={styles.subtitle}>Other Vehicles</Text></View><TouchableOpacity onPress={onClose}><Icon name="close" size={22} color={colors.textMuted} /></TouchableOpacity></View>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <TouchableOpacity style={styles.resetRow} onPress={() => setDraft(OTHER_FILTER_DEFAULTS)}><Text style={styles.reset}>Reset All</Text><Icon name="refresh-outline" size={17} color={colors.textMuted} /></TouchableOpacity>
      <Text style={styles.label}>Price Range (₹)</Text><View style={styles.priceRow}><TextInput value={String(draft.minPrice)} onChangeText={text => update('minPrice', Number(text.replace(/[^0-9]/g, '')) || MIN_PRICE)} keyboardType="number-pad" style={styles.input} /><Text style={styles.dash}>–</Text><TextInput value={String(draft.maxPrice)} onChangeText={text => update('maxPrice', Number(text.replace(/[^0-9]/g, '')) || MAX_PRICE)} keyboardType="number-pad" style={styles.input} /></View><PriceSlider min={draft.minPrice} max={draft.maxPrice} onChange={(minPrice, maxPrice) => setDraft(current => ({...current, minPrice, maxPrice}))} /><View style={styles.rangeLabels}><Text style={styles.help}>₹50,000</Text><Text style={styles.help}>₹1,00,00,000+</Text></View>
      <Text style={styles.label}>Vehicle Type</Text><VehicleTypeDropdown compact enabled={visible} category="Other" value={{VEHICLETYPENAME: draft.type === 'All' ? '' : draft.type, VEHICLETYPEID: draft.VEHICLETYPEID}} placeholder="All" open={opened === 'type'} onOpenChange={open => setOpened(open ? 'type' : null)} onChange={type => setDraft(current => ({...current, type: type?.VEHICLETYPENAME || 'All', VEHICLETYPEID: type?.VEHICLETYPEID ?? null, VEHICLETYPECODE: type?.VEHICLETYPECODE || '', brand: 'All Brands', VehicleBrandId: null, model: 'All Models'}))} />
      <Text style={styles.label}>Fuel Type</Text><View style={styles.chips}>{['All', 'Diesel', 'Petrol', 'CNG', 'Electric', 'LPG'].map(value => <Chip key={value} label={value} active={draft.fuel === value} onPress={() => update('fuel', value)} />)}</View>
      <Text style={styles.label}>Registration Year</Text><View style={styles.yearRow}><View style={styles.yearCol}><Text style={styles.help}>From</Text><Dropdown name="yearFrom" value={draft.yearFrom} options={years} opened={opened} setOpened={setOpened} onSelect={value => update('yearFrom', value)} /></View><View style={styles.yearCol}><Text style={styles.help}>To</Text><Dropdown name="yearTo" value={draft.yearTo} options={years} opened={opened} setOpened={setOpened} onSelect={value => update('yearTo', value)} /></View></View>
      <Text style={styles.label}>Brand</Text><BrandDropdown compact enabled={visible} disabled={!draft.VEHICLETYPEID} vehicleTypeId={draft.VEHICLETYPEID} value={{BrandName: draft.brand, VehicleBrandId: draft.VehicleBrandId}} placeholder="All Brands" open={opened === 'brand'} onOpenChange={open => setOpened(open ? 'brand' : null)} onChange={brand => setDraft(current => ({...current, brand: brand?.BrandName || 'All Brands', VehicleBrandId: brand?.VehicleBrandId ?? null, model: 'All Models'}))} />
      <Text style={styles.label}>Model</Text><Dropdown name="model" value={draft.model} options={models} opened={opened} setOpened={setOpened} onSelect={value => update('model', value)} />
    </ScrollView>
    <View style={styles.actions}><TouchableOpacity style={styles.apply} onPress={() => onApply(draft)}><Text style={styles.applyText}>Apply Filters</Text></TouchableOpacity><TouchableOpacity style={styles.clear} onPress={() => setDraft(OTHER_FILTER_DEFAULTS)}><Text style={styles.clearText}>Clear All</Text></TouchableOpacity></View>
  </View><Pressable style={styles.backdrop} onPress={onClose} /></View></Modal>;
};
export default OtherVehicleFilterDrawer;

const createStyles = colors => StyleSheet.create({
  root: {flex: 1, flexDirection: 'row'}, panel: {width: '86%', maxWidth: 400, backgroundColor: colors.surface, borderRightWidth: 1, borderRightColor: colors.border}, backdrop: {flex: 1, backgroundColor: 'rgba(0,0,0,0.55)'}, header: {paddingTop: 42, paddingHorizontal: 17, paddingBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border}, title: {fontSize: 20, fontWeight: '800', color: colors.text}, subtitle: {fontSize: 10, color: colors.textMuted, marginTop: 3}, content: {paddingHorizontal: 17, paddingBottom: 20}, resetRow: {height: 46, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, reset: {fontSize: 12, fontWeight: '700', color: '#ff1838'}, label: {fontSize: 12, fontWeight: '700', color: colors.text, marginTop: 15, marginBottom: 8},
  priceRow: {flexDirection: 'row', alignItems: 'center'}, input: {flex: 1, height: 40, borderWidth: 1, borderColor: colors.border, borderRadius: 6, backgroundColor: colors.surfaceMuted, color: colors.text, fontSize: 11, paddingHorizontal: 9}, dash: {color: colors.textMuted, marginHorizontal: 7}, slider: {height: 34, marginHorizontal: 7, justifyContent: 'center'}, track: {position: 'absolute', left: 0, right: 0, height: 4, backgroundColor: colors.textMuted}, fill: {position: 'absolute', height: 4, backgroundColor: '#ff1838'}, knob: {position: 'absolute', marginLeft: -7, width: 15, height: 15, borderRadius: 8, backgroundColor: colors.surface, borderWidth: 2, borderColor: '#ff1838'}, rangeLabels: {flexDirection: 'row', justifyContent: 'space-between'}, help: {fontSize: 9, color: colors.textMuted},
  chips: {flexDirection: 'row', flexWrap: 'wrap', gap: 7}, chip: {height: 34, paddingHorizontal: 9, borderRadius: 5, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center'}, chipActive: {borderColor: '#ff1838'}, chipText: {fontSize: 9, color: colors.text}, chipTextActive: {color: '#ff1838', fontWeight: '700'}, dropdown: {height: 39, paddingHorizontal: 9, borderWidth: 1, borderColor: colors.border, borderRadius: 5, backgroundColor: colors.surfaceMuted, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, dropdownActive: {borderColor: '#ff1838'}, dropdownText: {fontSize: 10, color: colors.text}, options: {borderWidth: 1, borderTopWidth: 0, borderColor: colors.border, backgroundColor: colors.surface}, option: {minHeight: 34, paddingHorizontal: 9, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.border}, optionText: {fontSize: 10, color: colors.text}, optionSelected: {color: '#ff1838', fontWeight: '700'}, yearRow: {flexDirection: 'row', gap: 8}, yearCol: {flex: 1, gap: 5}, actions: {padding: 16, borderTopWidth: 1, borderTopColor: colors.border}, apply: {height: 46, borderRadius: 5, backgroundColor: '#ff1838', alignItems: 'center', justifyContent: 'center'}, applyText: {fontSize: 13, fontWeight: '800', color: '#fff'}, clear: {height: 43, marginTop: 9, borderRadius: 5, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center'}, clearText: {fontSize: 12, color: colors.text},
});
