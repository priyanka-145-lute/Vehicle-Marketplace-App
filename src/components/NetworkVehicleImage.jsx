import {useThemeStyles} from '../theme/colors';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const NetworkVehicleImage = ({uri, fallbackUri, style}) => {
  const {colors, styles} = useThemeStyles(createStyles);

  const [sourceUri, setSourceUri] = useState(uri);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSourceUri(uri);
    setFailed(false);
  }, [uri]);

  if (failed) {
    return (
      <View style={[style, styles.fallback]}>
        <Icon name="car-sport-outline" size={42} color={colors.textMuted} />
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

const createStyles = colors => StyleSheet.create({
  fallback: {
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
