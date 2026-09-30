import {colors} from '../theme/colors';
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const SectionHeader = ({emoji, title, onViewAll}) => {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.leftRow}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <TouchableOpacity onPress={onViewAll}>
        <Text style={styles.viewAll}>View All</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SectionHeader;

const styles = StyleSheet.create({
  sectionHeader: {
    marginTop: 24,
    marginBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 6,
  },
  viewAll: {
    color: 'red',
    fontSize: 13,
    fontWeight: '700',
  },
});