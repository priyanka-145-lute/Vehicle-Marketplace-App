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
      accessibilityRole="button"
      accessibilityLabel={item.title}
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

      <View style={styles.imageFrame}>
        <Image source={{uri: item.image}} style={styles.image} />
      </View>

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
          color={colors.text}
        />
      </View>

    </TouchableOpacity>
  );
};

export default CategoryCard;

const createStyles = colors => StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#0f172a',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  imageFrame: {width: 68, height: 68, borderRadius: 12, overflow: 'hidden', backgroundColor: colors.surfaceMuted},
  image: {width: '100%', height: '100%', resizeMode: 'cover'},
  content: {flex: 1, marginLeft: 12, marginRight: 8, paddingVertical: 2},
  title: {fontSize: 16, lineHeight: 22, fontWeight: '700', color: colors.text},
  subtitle: {fontSize: 12, color: colors.textMuted, marginTop: 5, lineHeight: 18},
  arrowButton: {width: 30, height: 30, borderRadius: 10, backgroundColor: colors.accentSurface, justifyContent: 'center', alignItems: 'center'},
});
