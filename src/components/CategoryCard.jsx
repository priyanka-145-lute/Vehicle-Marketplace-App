import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';

const CategoryCard = ({ item }) => {

  const navigation = useNavigation();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
     onPress={() => {
       if (item.type === 'other') {
         navigation.navigate('VehicleScreen', {vehicleType: 'other'});
         return;
       }
       if (item.type === '2wheeler-parts' || item.type === '4wheeler-parts') {
         navigation.navigate('Parts', {partType: item.type});
         return;
       }
       navigation.navigate('VehicleScreen', {vehicleType: item.type});
     }}
      style={styles.container}
    >

      <Image
        source={{ uri: item.image }}
        style={styles.image}
      />

      <View style={styles.content}>

        <Text style={styles.title}>
          {item.title}
        </Text>

        <Text style={styles.subtitle}>
          {item.subtitle}
        </Text>

      </View>

      <View style={styles.arrowButton}>
        <Icon
          name="chevron-forward"
          size={20}
          color="#fff"
        />
      </View>

    </TouchableOpacity>
  );
};

export default CategoryCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },

  image: {
    width: 95,
    height: 75,
    resizeMode: 'contain',
  },

  content: {
    flex: 1,
    marginLeft: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },

  subtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 5,
    lineHeight: 18,
  },

  arrowButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
