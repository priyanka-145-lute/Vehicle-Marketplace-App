import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

const MySalesScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>My Sales Screen</Text>
    </SafeAreaView>
  );
};

export default MySalesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});