import {useThemeStyles} from '../theme/colors';
import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../context/ThemeContext';

const SearchBar = ({value, onChangeText, onSaveSearch, compact, placeholder = 'Search categories...'}) => {
  const {styles} = useThemeStyles(createStyles);

  const {isDark} = useTheme();
  return (
    <View style={[styles.container, isDark && styles.containerDark, compact && styles.compact]}>

      <Icon
        name="search"
        size={20}
        color={isDark ? '#cbd5e1' : '#777'}
      />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={[styles.input, isDark && styles.inputDark]}
        placeholderTextColor={isDark ? '#94a3b8' : '#777'}
      />

      {value ? <TouchableOpacity onPress={() => onChangeText('')} accessibilityLabel="Clear search"><Icon name="close-circle" size={21} color={isDark ? '#cbd5e1' : '#777'} /></TouchableOpacity> : null}

      {onSaveSearch && <TouchableOpacity onPress={onSaveSearch} accessibilityLabel="Save search">
        <Icon
          name="options-outline"
          size={22}
          color={isDark ? '#cbd5e1' : '#777'}
        />
      </TouchableOpacity>}

    </View>
  );
};

export default SearchBar;

const createStyles = colors => StyleSheet.create({
  compact: {height: 40, marginTop: 6, borderRadius: 22},
  container: {
    backgroundColor: colors.surface,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  containerDark: {backgroundColor: '#1f2937'},

  input: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 14,
    color: colors.text,
  },
  inputDark: {color: '#f8fafc'},
});
