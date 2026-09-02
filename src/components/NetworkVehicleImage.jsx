import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const NetworkVehicleImage = ({uri, fallbackUri, style}) => {
  const [sourceUri, setSourceUri] = useState(uri);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSourceUri(uri);
    setFailed(false);
  }, [uri]);

  if (failed) {
    return (
      <View style={[style, styles.fallback]}>
        <Icon name="car-sport-outline" size={42} color="#94a3b8" />
      </View>
    );
  }

  return (
    <Image
      source={{uri: sourceUri}}
      style={style}
      onError={() => {
        if (sourceUri !== fallbackUri) {
          setSourceUri(fallbackUri);
        } else {
          setFailed(true);
        }
      }}
    />
  );
};

export default NetworkVehicleImage;

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
