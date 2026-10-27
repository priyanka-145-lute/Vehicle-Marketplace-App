import {useThemeStyles} from '../../theme/colors';
import React, {useEffect} from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, View} from 'react-native';

const SplashScreen = ({navigation}) => {
  const {styles} = useThemeStyles(createStyles);

  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('Onboarding'), 2200);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoWrap}>
        <Image source={require('../../assets/images/gadi-dekho-logo-transparent.png')} style={styles.logo} />
      </View>
      <Text style={styles.tagline}>Your trusted vehicle marketplace</Text>
      <ActivityIndicator style={styles.loader} size="small" color="#ef4444" />
    </View>
  );
};

export default SplashScreen;

const createStyles = colors => StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center'},
  logoWrap: {width: 280, height: 150, borderRadius: 24, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center'},
  logo: {width: 280, height: 150, resizeMode: 'contain'},
  tagline: {fontSize: 14, color: colors.textMuted, marginTop: 8},
  loader: {position: 'absolute', bottom: 55},
});
