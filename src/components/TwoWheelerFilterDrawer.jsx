import React, {useState} from 'react';
import {Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const MIN_PRICE = 10000;
const MAX_PRICE = 500000;

export const TWO_WHEELER_FILTER_DEFAULTS = {
  type: 'All', fuel: 'All', minPrice: MIN_PRICE, maxPrice: MAX_PRICE,
  yearFrom: 'Any Year', yearTo: 'Any Year', brand: 'All Brands', model: 'All Models',
};

const Chip = ({label, active, onPress}) => (
  <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
    <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const Dropdown = ({name, value, values, openName, setOpenName, onChange}) => {
  const open = openName === name;
  return (
    <View style={styles.dropdownWrap}>
      <TouchableOpacity style={[styles.dropdown, open && styles.dropdownOpen]} onPress={() => setOpenName(open ? null : name)}>
        <Text style={styles.dropdownText}>{value}</Text>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={14} color="#64748b" />
      </TouchableOpacity>
      {open ? <View style={styles.dropdownOptions}>{values.map(option => (
        <TouchableOpacity key={option} style={styles.dropdownOption} onPress={() => {onChange(option); setOpenName(null);}}>
          <Text style={[styles.optionText, option === value && styles.optionActive]}>{option}</Text>
          {option === value ? <Icon name="checkmark" size={15} color="#ff1838" /> : null}
        </TouchableOpacity>
      ))}</View> : null}
    </View>
  );
};

const PriceSlider = ({min, max, onChange}) => {
  const [width, setWidth] = useState(1);
  const minPosition = ((min - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
  const maxPosition = ((max - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

  const updateFromTouch = event => {
    const ratio = Math.max(0, Math.min(1, event.nativeEvent.locationX / width));
    const value = Math.round((MIN_PRICE + ratio * (MAX_PRICE - MIN_PRICE)) / 5000) * 5000;
    if (Math.abs(value - min) <= Math.abs(value - max)) onChange(Math.min(value, max - 5000), max);
    else onChange(min, Math.max(value, min + 5000));
  };

  return (
    <View style={styles.sliderTouch} onLayout={event => setWidth(event.nativeEvent.layout.width)} onStartShouldSetResponder={() => true} onMoveShouldSetResponder={() => true} onResponderGrant={updateFromTouch} onResponderMove={updateFromTouch}>
      <View style={styles.sliderTrack} />
      <View style={[styles.sliderFill, {left: `${minPosition}%`, right: `${100 - maxPosition}%`}]} />
      <View style={[styles.sliderKnob, {left: `${minPosition}%`}]} />
      <View style={[styles.sliderKnob, {left: `${maxPosition}%`}]} />
    </View>
  );
};

const TwoWheelerFilterDrawer = ({visible, filters, onClose, onApply}) => {
  const [draft, setDraft] = useState(filters);
  const [openDropdown, setOpenDropdown] = useState(null);

  React.useEffect(() => {
    if (visible) {setDraft(filters); setOpenDropdown(null);}
  }, [filters, visible]);

  const update = (key, value) => setDraft(current => ({...current, [key]: value}));
  const years = ['Any Year', '2026', '2025', '2024', '2023', '2022', '2021', '2020'];
  const brands = ['All Brands', 'Yamaha', 'Honda', 'Royal Enfield', 'KTM', 'Suzuki', 'TVS', 'Ather', 'Bajaj'];
  const models = ['All Models', 'R15 V4', 'Activa 6G', 'Classic 350', 'Duke 390', 'Access 125', 'Apache RTR 200', '450X', 'Pulsar N160'];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <View style={styles.panel}>
          <View style={styles.header}><View><Text style={styles.title}>Filters</Text><Text style={styles.subtitle}>Two Wheelers</Text></View><TouchableOpacity onPress={onClose}><Icon name="close" size={22} color="#64748b" /></TouchableOpacity></View>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <TouchableOpacity style={styles.resetRow} onPress={() => setDraft(TWO_WHEELER_FILTER_DEFAULTS)}><Text style={styles.reset}>Reset All</Text><Icon name="refresh-outline" size={17} color="#64748b" /></TouchableOpacity>
            <Text style={styles.label}>Price Range (₹)</Text>
            <View style={styles.priceInputs}><TextInput value={String(draft.minPrice)} onChangeText={text => update('minPrice', Number(text.replace(/[^0-9]/g, '')) || MIN_PRICE)} keyboardType="number-pad" style={styles.input} /><Text style={styles.dash}>–</Text><TextInput value={String(draft.maxPrice)} onChangeText={text => update('maxPrice', Number(text.replace(/[^0-9]/g, '')) || MAX_PRICE)} keyboardType="number-pad" style={styles.input} /></View>
            <PriceSlider min={draft.minPrice} max={draft.maxPrice} onChange={(minPrice, maxPrice) => setDraft(current => ({...current, minPrice, maxPrice}))} />
            <View style={styles.priceLabels}><Text style={styles.help}>₹10,000</Text><Text style={styles.help}>₹5,00,000</Text></View>

            <Text style={styles.label}>Vehicle Type</Text><View style={styles.chipRow}>{['All', 'Motorcycle', 'Scooter', 'Moped'].map(value => <Chip key={value} label={value} active={draft.type === value} onPress={() => update('type', value)} />)}</View>
            <Text style={styles.label}>Fuel Type</Text><View style={styles.chipRow}>{['All', 'Petrol', 'Electric', 'CNG'].map(value => <Chip key={value} label={value} active={draft.fuel === value} onPress={() => update('fuel', value)} />)}</View>

            <Text style={styles.label}>Registration Year</Text><View style={styles.yearRow}><View style={styles.yearColumn}><Text style={styles.help}>From</Text><Dropdown name="yearFrom" value={draft.yearFrom} values={years} openName={openDropdown} setOpenName={setOpenDropdown} onChange={value => update('yearFrom', value)} /></View><View style={styles.yearColumn}><Text style={styles.help}>To</Text><Dropdown name="yearTo" value={draft.yearTo} values={years} openName={openDropdown} setOpenName={setOpenDropdown} onChange={value => update('yearTo', value)} /></View></View>
            <Text style={styles.label}>Brand</Text><Dropdown name="brand" value={draft.brand} values={brands} openName={openDropdown} setOpenName={setOpenDropdown} onChange={value => update('brand', value)} />
            <Text style={styles.label}>Model</Text><Dropdown name="model" value={draft.model} values={models} openName={openDropdown} setOpenName={setOpenDropdown} onChange={value => update('model', value)} />
          </ScrollView>
          <View style={styles.actions}><TouchableOpacity style={styles.applyButton} onPress={() => onApply(draft)}><Text style={styles.applyText}>Apply Filters</Text></TouchableOpacity><TouchableOpacity style={styles.clearButton} onPress={() => setDraft(TWO_WHEELER_FILTER_DEFAULTS)}><Text style={styles.clearText}>Clear All</Text></TouchableOpacity></View>
        </View>
        <Pressable style={styles.backdrop} onPress={onClose} />
      </View>
    </Modal>
  );
};

export default TwoWheelerFilterDrawer;

const styles = StyleSheet.create({
  modalRoot: {flex: 1, flexDirection: 'row'}, panel: {width: '84%', maxWidth: 390, backgroundColor: '#ffffff', borderRightWidth: 1, borderRightColor: '#e2e8f0'}, backdrop: {flex: 1, backgroundColor: 'rgba(0,0,0,0.55)'}, header: {paddingTop: 42, paddingHorizontal: 17, paddingBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#e2e8f0'}, title: {fontSize: 20, fontWeight: '800', color: '#111827'}, subtitle: {fontSize: 10, color: '#64748b', marginTop: 3}, content: {paddingHorizontal: 17, paddingBottom: 20}, resetRow: {height: 46, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, reset: {fontSize: 12, fontWeight: '700', color: '#ff1838'}, label: {fontSize: 12, fontWeight: '700', color: '#111827', marginTop: 16, marginBottom: 8},
  priceInputs: {flexDirection: 'row', alignItems: 'center'}, input: {flex: 1, height: 40, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 6, backgroundColor: '#f8fafc', color: '#111827', fontSize: 11, paddingHorizontal: 9}, dash: {color: '#83919c', marginHorizontal: 7}, sliderTouch: {height: 34, marginHorizontal: 7, justifyContent: 'center'}, sliderTrack: {position: 'absolute', left: 0, right: 0, height: 4, backgroundColor: '#cbd5e1'}, sliderFill: {position: 'absolute', height: 4, backgroundColor: '#ff1838'}, sliderKnob: {position: 'absolute', marginLeft: -7, width: 15, height: 15, borderRadius: 8, backgroundColor: '#fff', borderWidth: 2, borderColor: '#ff1838'}, priceLabels: {flexDirection: 'row', justifyContent: 'space-between'}, help: {fontSize: 9, color: '#64748b'},
  chipRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 7}, chip: {height: 34, paddingHorizontal: 10, borderRadius: 5, borderWidth: 1, borderColor: '#cbd5e1', backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center'}, chipActive: {borderColor: '#ff1838'}, chipText: {fontSize: 10, color: '#334155'}, chipTextActive: {color: '#ff1838', fontWeight: '700'}, yearRow: {flexDirection: 'row', gap: 8}, yearColumn: {flex: 1, gap: 5}, dropdownWrap: {zIndex: 2}, dropdown: {height: 39, paddingHorizontal: 9, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 5, backgroundColor: '#f8fafc', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, dropdownOpen: {borderColor: '#ff1838'}, dropdownText: {flex: 1, fontSize: 10, color: '#334155'}, dropdownOptions: {borderWidth: 1, borderTopWidth: 0, borderColor: '#cbd5e1', borderBottomLeftRadius: 5, borderBottomRightRadius: 5, backgroundColor: '#ffffff'}, dropdownOption: {minHeight: 34, paddingHorizontal: 9, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#e2e8f0'}, optionText: {fontSize: 10, color: '#334155'}, optionActive: {color: '#ff1838', fontWeight: '700'},
  actions: {padding: 16, borderTopWidth: 1, borderTopColor: '#e2e8f0'}, applyButton: {height: 46, borderRadius: 5, backgroundColor: '#ff1838', alignItems: 'center', justifyContent: 'center'}, applyText: {fontSize: 13, fontWeight: '800', color: '#fff'}, clearButton: {height: 43, marginTop: 9, borderRadius: 5, borderWidth: 1, borderColor: '#cbd5e1', alignItems: 'center', justifyContent: 'center'}, clearText: {fontSize: 12, color: '#334155'},
});
