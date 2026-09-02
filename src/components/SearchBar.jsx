import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

const SearchBar = () => {
  return (
    <View style={styles.container}>
      
      <Icon
        name="search"
        size={20}
        color="#777"
      />

      <TextInput
        placeholder="Search for cars, brands, models..."
        placeholderTextColor="#777"
        style={styles.input}
      />

      <TouchableOpacity>
        <Icon
          name="options-outline"
          size={22}
          color="#777"
        />
      </TouchableOpacity>

    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },

  input: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 14,
    color: '#111',
  },
});
