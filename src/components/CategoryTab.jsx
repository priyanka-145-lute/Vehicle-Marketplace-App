import {colors} from '../theme/colors';
import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';

const CategoryTab = ({label, isSelected, onPress}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.tabButton, isSelected && styles.activeTabButton]}>
      <Text style={[styles.tabText, isSelected && styles.activeTabText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryTab;

const styles = StyleSheet.create({
  tabButton: {
    backgroundColor: colors.surface,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 14,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activeTabButton: {
    backgroundcolor: colors.text,
  },
  tabText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 13,
  },
  activeTabText: {
    color: '#fff',
  },
});