import React, {useEffect} from 'react';
import {ActivityIndicator, Image, StatusBar, StyleSheet, Text, View} from 'react-native';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('Onboarding'), 2200);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.logoWrap}>
        <Image source={require('../../assets/images/headerlogo.png')} style={styles.logo} />
      </View>
      <Text style={styles.tagline}>Your trusted vehicle marketplace</Text>
      <ActivityIndicator style={styles.loader} size="small" color="#ef4444" />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center'},
  logoWrap: {width: 250, height: 100, borderRadius: 24, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center'},
  logo: {width: 220, height: 68, resizeMode: 'contain'},
  tagline: {fontSize: 14, color: '#64748b', marginTop: 8},
  loader: {position: 'absolute', bottom: 55},
});
