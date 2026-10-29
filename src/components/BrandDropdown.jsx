import React from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useGetBrandsQuery} from '../redux/api';
import {useThemeStyles} from '../theme/colors';

const BrandDropdown = ({vehicleType, vehicleTypeId, value, onChange, open, onOpenChange, enabled = true, disabled = false, compact = false, placeholder = 'Select brand'}) => {
  const {styles} = useThemeStyles(createStyles);
  const {currentData, isFetching, isError, refetch} = useGetBrandsQuery(undefined, {skip: !enabled});
  const failed = isError || (currentData && (currentData.success !== true || !Array.isArray(currentData.data)));
  const brands = !failed && Array.isArray(currentData?.data)
    ? currentData.data.filter(item => item && ['number', 'string'].includes(typeof item.VehicleBrandId) && ['number', 'string'].includes(typeof item.VEHICLETYPEID) && typeof item.BrandName === 'string' && (vehicleTypeId != null ? String(item.VEHICLETYPEID) === String(vehicleTypeId) : item.VEHICLETYPENAME === vehicleType))
      .sort((a, b) => (Number(a.DisplayOrder) || 0) - (Number(b.DisplayOrder) || 0))
    : [];
  const select = brand => {onChange(brand); onOpenChange(false);};

  return <View>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Select Brand" accessibilityState={{expanded: Boolean(open), disabled: disabled || !enabled}} disabled={disabled || !enabled} style={[styles.input, compact && styles.compactInput, disabled && styles.disabled]} onPress={() => onOpenChange(!open)}>
      <Text style={[styles.text, compact && styles.compactText]}>{value?.BrandName || placeholder}</Text><Text style={styles.muted}>{open ? '▴' : '▾'}</Text>
    </TouchableOpacity>
    {enabled && isFetching ? <ActivityIndicator accessibilityLabel="Loading brands" color="#ef4444" /> : null}
    {enabled && failed && !isFetching ? <View><Text accessibilityRole="alert" style={styles.error}>Could not load brands.</Text><TouchableOpacity accessibilityRole="button" accessibilityLabel="Retry brands" disabled={disabled} onPress={refetch} style={styles.option}><Text style={styles.retry}>Try Again</Text></TouchableOpacity></View> : null}
    {open && enabled && !disabled && !isFetching && !failed ? <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" style={styles.options}>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Clear brand" style={styles.option} onPress={() => select(null)}><Text style={[styles.text, compact && styles.compactText]}>{placeholder}</Text></TouchableOpacity>
      {brands.map(brand => <TouchableOpacity key={brand.VehicleBrandId} accessibilityRole="button" accessibilityLabel={`Brand: ${brand.BrandName}`} accessibilityState={{selected: brand.VehicleBrandId === value?.VehicleBrandId}} style={styles.option} onPress={() => select(brand)}><Text style={[styles.text, compact && styles.compactText]}>{brand.BrandName}</Text></TouchableOpacity>)}
      {!brands.length ? <Text style={styles.empty}>No brands available.</Text> : null}
    </ScrollView> : null}
  </View>;
};

export default BrandDropdown;

const createStyles = colors => StyleSheet.create({
  input: {minHeight: 50, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: colors.surface, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  compactInput: {minHeight: 39, paddingHorizontal: 9, paddingVertical: 8, borderRadius: 5, backgroundColor: colors.surfaceMuted},
  text: {fontSize: 14, color: colors.text, flexShrink: 1}, compactText: {fontSize: 10}, muted: {color: colors.textMuted}, disabled: {opacity: 0.5},
  options: {maxHeight: 220, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface}, option: {minHeight: 40, paddingHorizontal: 12, paddingVertical: 10, justifyContent: 'center'},
  empty: {padding: 12, color: colors.textMuted, fontSize: 12}, error: {color: '#dc2626', fontSize: 12, marginTop: 6}, retry: {color: '#ef4444', fontSize: 13, fontWeight: '600'},
});
