import React, {useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useGetAreasQuery, useGetCitiesQuery, useGetCountriesQuery, useGetStatesQuery} from '../redux/api';
import {useThemeStyles} from '../theme/colors';

const LocationFields = ({value = {}, onChange, disabled = false}) => {
  const {styles} = useThemeStyles(createStyles);
  const [open, setOpen] = useState(null);
  const location = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const countries = useGetCountriesQuery();
  const states = useGetStatesQuery(location.countryId, {skip: !location.countryId});
  const cities = useGetCitiesQuery(location.stateId, {skip: !location.stateId});
  const areas = useGetAreasQuery(location.cityId, {skip: !location.cityId});
  const fields = [
    ['Country', 'country', countries, true],
    ['State', 'state', states, Boolean(location.countryId)],
    ['City', 'city', cities, Boolean(location.stateId)],
    ['Area', 'area', areas, Boolean(location.cityId)],
  ];
  const select = (key, item) => {
    let next;
    if (key === 'country') {
      next = {countryId: item.CountryID, countryName: item.CountryName};
    } else if (key === 'state') {
      next = {countryId: location.countryId, countryName: location.countryName, stateId: item.StateID, stateName: item.StateName};
    } else if (key === 'city') {
      next = {countryId: location.countryId, countryName: location.countryName, stateId: location.stateId, stateName: location.stateName, cityId: item.CityID, cityName: item.CityName};
    } else {
      next = {...location, areaId: item.AreaID, areaName: item.AreaName, pincode: String(item.Pincode ?? '')};
    }
    onChange(next);
    setOpen(null);
  };

  return <View style={styles.fields}>
    {fields.map(([label, key, query, enabled]) => {
      const response = query.currentData;
      const idKey = `${label}ID`;
      const nameKey = `${label}Name`;
      const invalidRows = Array.isArray(response?.data) && response.data.some(item => !item || !['number', 'string'].includes(typeof item[idKey]) || typeof item[nameKey] !== 'string');
      const failed = query.isError || invalidRows || (response && (response.success !== true || !Array.isArray(response.data)));
      const rows = !failed && Array.isArray(response?.data) ? response.data : [];
      const isOpen = open === key && enabled && !disabled;
      const selected = typeof location[`${key}Name`] === 'string' ? location[`${key}Name`] : '';
      return <View key={key} style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Select ${label}`} accessibilityState={{expanded: isOpen, disabled: disabled || !enabled}} disabled={disabled || !enabled} onPress={() => setOpen(isOpen ? null : key)} style={[styles.input, (disabled || !enabled) && styles.disabled]}>
          <Text style={selected ? styles.text : styles.muted}>{selected || `Select ${label.toLowerCase()}`}</Text><Text style={styles.muted}>{isOpen ? '▴' : '▾'}</Text>
        </TouchableOpacity>
        {enabled && query.isFetching ? <ActivityIndicator accessibilityLabel={`Loading ${label}`} color="#ef4444" /> : null}
        {enabled && failed && !query.isFetching ? <View><Text accessibilityRole="alert" style={styles.error}>Could not load {label.toLowerCase()} options.</Text><TouchableOpacity accessibilityRole="button" accessibilityLabel={`Retry ${label}`} disabled={disabled} onPress={query.refetch} style={styles.option}><Text style={styles.retry}>Try Again</Text></TouchableOpacity></View> : null}
        {isOpen && !query.isFetching && !failed ? <ScrollView style={styles.options} nestedScrollEnabled keyboardShouldPersistTaps="handled">
          {rows.length ? rows.map(item => <TouchableOpacity key={item[idKey]} accessibilityRole="button" accessibilityLabel={`${label}: ${item[nameKey]}`} accessibilityState={{selected: location[`${key}Id`] === item[idKey]}} onPress={() => select(key, item)} style={styles.option}><Text style={styles.text}>{item[nameKey]}</Text></TouchableOpacity>) : <Text style={styles.empty}>No {label.toLowerCase()} options available.</Text>}
        </ScrollView> : null}
      </View>;
    })}
    {location.pincode ? <Text style={styles.text}>Pincode: {location.pincode}</Text> : null}
    {location.countryId ? <TouchableOpacity accessibilityRole="button" accessibilityLabel="Clear location" disabled={disabled} onPress={() => {onChange({}); setOpen(null);}} style={styles.clear}><Text style={styles.retry}>Clear location</Text></TouchableOpacity> : null}
  </View>;
};

export default LocationFields;

const createStyles = colors => StyleSheet.create({
  fields: {gap: 14}, field: {gap: 8}, label: {fontSize: 13, fontWeight: '600', color: colors.text},
  input: {minHeight: 50, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 12, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8},
  text: {fontSize: 14, color: colors.text, flexShrink: 1}, muted: {fontSize: 14, color: colors.textMuted}, disabled: {opacity: 0.5},
  options: {maxHeight: 220, borderWidth: 1, borderColor: colors.border, borderRadius: 10, backgroundColor: colors.surface},
  option: {minHeight: 44, paddingHorizontal: 14, paddingVertical: 12, justifyContent: 'center'}, empty: {padding: 14, color: colors.textMuted},
  error: {color: '#dc2626', fontSize: 13}, retry: {color: '#ef4444', fontSize: 13, fontWeight: '600'}, clear: {alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center'},
});
