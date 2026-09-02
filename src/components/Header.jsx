import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

const Header = () => {
  return (
    <View style={styles.container}>
      
      <TouchableOpacity style={styles.menuButton}>
        <Icon name="menu" size={28} color="#111" />
      </TouchableOpacity>

     <Image
  source={require('../assets/images/headerlogo.png')}
  style={styles.logo}
/>
        
      <View style={styles.rightContainer}>
        
        <TouchableOpacity style={styles.notificationContainer}>
          <Icon
            name="notifications-outline"
            size={24}
            color="#111"
          />

        
        </TouchableOpacity>

        <TouchableOpacity style={styles.heartContainer}>
          <Icon
            name="heart-outline"
            size={24}
            color="#111"
          />
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  logo: {
    top: 5,
    width: 160,
    height: 40,
    resizeMode: 'contain',
  },

  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuButton: {
    top: 5,
  },

  notificationContainer: {
    marginRight: 15,
    top :5
  },

  heartContainer: {
    top :5
  }

});
