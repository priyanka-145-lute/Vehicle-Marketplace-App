import {useThemeStyles} from '../theme/colors';
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
  const {colors, styles} = useThemeStyles(createStyles);


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
       if (item.type === 'services') {
         navigation.navigate('Services');
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
          color={colors.surface}
        />
      </View>

    </TouchableOpacity>
  );
};

export default CategoryCard;

const createStyles = colors => StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
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
    color: colors.text,
  },

  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 5,
    lineHeight: 18,
  },

  arrowButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.text,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
