import React from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useGetVehicleCategoriesQuery} from '../redux/api';
import {useThemeStyles} from '../theme/colors';

const VehicleCategoryDropdown = ({vehicleTypeId, value, onChange, open, onOpenChange, enabled = true, disabled = false, compact = false, placeholder = 'Select vehicle category'}) => {
  const {styles} = useThemeStyles(createStyles);
  const ready = enabled && vehicleTypeId != null;
  const {currentData, isFetching, isError, refetch} = useGetVehicleCategoriesQuery(vehicleTypeId, {skip: !ready});
  const invalidRows = Array.isArray(currentData?.data) && currentData.data.some(item => !item || !['number', 'string'].includes(typeof item.VehicleCategoryId) || !['number', 'string'].includes(typeof item.VEHICLETYPEID) || typeof item.CATEGORYNAME !== 'string');
  const failed = isError || invalidRows || (currentData && (currentData.success !== true || !Array.isArray(currentData.data)));
  const categories = !failed && Array.isArray(currentData?.data) ? currentData.data.filter(item => String(item.VEHICLETYPEID) === String(vehicleTypeId)) : [];
  const select = item => {onChange(item); onOpenChange(false);};

  return <View>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Select Vehicle Category" accessibilityState={{expanded: Boolean(open && ready), disabled: disabled || !ready}} disabled={disabled || !ready} style={[styles.input, compact && styles.compactInput, (disabled || !ready) && styles.disabled]} onPress={() => onOpenChange(!open)}><Text style={[styles.text, compact && styles.compactText]}>{value?.CATEGORYNAME || placeholder}</Text><Text style={styles.muted}>{open && ready ? '▴' : '▾'}</Text></TouchableOpacity>
    {ready && isFetching ? <ActivityIndicator accessibilityLabel="Loading vehicle categories" color="#ef4444" /> : null}
    {ready && failed && !isFetching ? <View><Text accessibilityRole="alert" style={styles.error}>Could not load vehicle categories.</Text><TouchableOpacity accessibilityRole="button" accessibilityLabel="Retry vehicle categories" disabled={disabled} style={styles.option} onPress={refetch}><Text style={styles.retry}>Try Again</Text></TouchableOpacity></View> : null}
    {open && ready && !disabled && !isFetching && !failed ? <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" style={styles.options}>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Clear vehicle category" style={styles.option} onPress={() => select(null)}><Text style={[styles.text, compact && styles.compactText]}>{placeholder}</Text></TouchableOpacity>
      {categories.map(item => <TouchableOpacity key={item.VehicleCategoryId} accessibilityRole="button" accessibilityLabel={`Vehicle Category: ${item.CATEGORYNAME}`} accessibilityState={{selected: item.VehicleCategoryId === value?.VehicleCategoryId}} style={styles.option} onPress={() => select(item)}><Text style={[styles.text, compact && styles.compactText]}>{item.CATEGORYNAME}</Text></TouchableOpacity>)}
      {!categories.length ? <Text style={styles.empty}>No vehicle categories available.</Text> : null}
    </ScrollView> : null}
  </View>;
};

export default VehicleCategoryDropdown;

const createStyles = colors => StyleSheet.create({
  input: {minHeight: 50, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: colors.surface, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  compactInput: {minHeight: 39, paddingHorizontal: 9, paddingVertical: 8, borderRadius: 5, backgroundColor: colors.surfaceMuted}, text: {fontSize: 14, color: colors.text, flexShrink: 1}, compactText: {fontSize: 10}, muted: {color: colors.textMuted}, disabled: {opacity: 0.5},
  options: {maxHeight: 220, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface}, option: {minHeight: 40, paddingHorizontal: 12, paddingVertical: 10, justifyContent: 'center'}, empty: {padding: 12, color: colors.textMuted, fontSize: 12}, error: {color: '#dc2626', fontSize: 12, marginTop: 6}, retry: {color: '#ef4444', fontSize: 13, fontWeight: '600'},
});
