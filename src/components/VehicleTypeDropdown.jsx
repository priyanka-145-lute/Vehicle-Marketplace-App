import React from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useGetVehicleTypesQuery} from '../redux/api';
import {useThemeStyles} from '../theme/colors';

const VehicleTypeDropdown = ({category = 'Other', value, onChange, open, onOpenChange, enabled = true, disabled = false, compact = false, placeholder = 'Select vehicle type'}) => {
  const {styles} = useThemeStyles(createStyles);
  const {currentData, isFetching, isError, refetch} = useGetVehicleTypesQuery(undefined, {skip: !enabled});
  const invalidRows = Array.isArray(currentData?.data) && currentData.data.some(item => !item || !['number', 'string'].includes(typeof item.VEHICLETYPEID) || typeof item.VEHICLETYPENAME !== 'string');
  const failed = isError || invalidRows || (currentData && (currentData.success !== true || !Array.isArray(currentData.data)));
  const types = !failed && Array.isArray(currentData?.data) ? currentData.data.filter(item => {
    if (category === '4 Wheeler') {return item.VEHICLETYPENAME === 'Car';}
    if (category === '2 Wheeler') {return ['Bike', 'Scooter'].includes(item.VEHICLETYPENAME);}
    return !['Car', 'Bike', 'Scooter'].includes(item.VEHICLETYPENAME);
  }) : [];
  const select = item => {onChange(item); onOpenChange(false);};

  return <View>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Select Vehicle Type" accessibilityState={{expanded: Boolean(open), disabled: disabled || !enabled}} disabled={disabled || !enabled} onPress={() => onOpenChange(!open)} style={[styles.input, compact && styles.compactInput, disabled && styles.disabled]}><Text style={[styles.text, compact && styles.compactText]}>{value?.VEHICLETYPENAME || placeholder}</Text><Text style={styles.muted}>{open ? '▴' : '▾'}</Text></TouchableOpacity>
    {enabled && isFetching ? <ActivityIndicator accessibilityLabel="Loading vehicle types" color="#ef4444" /> : null}
    {enabled && failed && !isFetching ? <View><Text accessibilityRole="alert" style={styles.error}>Could not load vehicle types.</Text><TouchableOpacity accessibilityRole="button" accessibilityLabel="Retry vehicle types" disabled={disabled} style={styles.option} onPress={refetch}><Text style={styles.retry}>Try Again</Text></TouchableOpacity></View> : null}
    {open && enabled && !disabled && !isFetching && !failed ? <ScrollView style={styles.options} nestedScrollEnabled keyboardShouldPersistTaps="handled">
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Clear vehicle type" style={styles.option} onPress={() => select(null)}><Text style={[styles.text, compact && styles.compactText]}>{placeholder}</Text></TouchableOpacity>
      {types.map(item => <TouchableOpacity key={item.VEHICLETYPEID} accessibilityRole="button" accessibilityLabel={`Vehicle Type: ${item.VEHICLETYPENAME}`} accessibilityState={{selected: item.VEHICLETYPEID === value?.VEHICLETYPEID}} style={styles.option} onPress={() => select(item)}><Text style={[styles.text, compact && styles.compactText]}>{item.VEHICLETYPENAME}</Text></TouchableOpacity>)}
      {!types.length ? <Text style={styles.empty}>No vehicle types available.</Text> : null}
    </ScrollView> : null}
  </View>;
};

export default VehicleTypeDropdown;

const createStyles = colors => StyleSheet.create({
  input: {minHeight: 50, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: colors.surface, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  compactInput: {minHeight: 39, paddingHorizontal: 9, paddingVertical: 8, borderRadius: 5, backgroundColor: colors.surfaceMuted}, text: {fontSize: 14, color: colors.text, flexShrink: 1}, compactText: {fontSize: 10}, muted: {color: colors.textMuted}, disabled: {opacity: 0.5},
  options: {maxHeight: 220, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface}, option: {minHeight: 40, paddingHorizontal: 12, paddingVertical: 10, justifyContent: 'center'}, empty: {padding: 12, color: colors.textMuted, fontSize: 12}, error: {color: '#dc2626', fontSize: 12, marginTop: 6}, retry: {color: '#ef4444', fontSize: 13, fontWeight: '600'},
});
