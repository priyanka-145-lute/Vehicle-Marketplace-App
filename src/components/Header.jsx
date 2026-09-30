import {colors} from '../theme/colors';
import React, {useState} from 'react';
import {
  Modal,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../context/ThemeContext';

const Header = ({onHeartPress, onNotificationPress, onSavedSearchesPress, onSettingsPress, onHelpPress, onLogoutPress}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const {isDark} = useTheme();
  const iconColor = isDark ? '#f8fafc' : '#111';
  const selectMenuItem = action => {
    setMenuVisible(false);
    action?.();
  };

  return (
    <>
      <View style={[styles.container, isDark && styles.containerDark]}>

      <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)} accessibilityLabel="Open menu">
        <Icon name="menu" size={28} color={iconColor} />
      </TouchableOpacity>

     <Image
  source={require('../assets/images/gadi-dekho-logo.png')}
  style={styles.logo}
/>

      <View style={styles.rightContainer}>

        <TouchableOpacity
          style={styles.notificationContainer}
          onPress={onNotificationPress}
          accessibilityLabel="Open notifications">
          <Icon
            name="notifications-outline"
            size={24}
            color={iconColor}
          />


        </TouchableOpacity>

        <TouchableOpacity
          style={styles.heartContainer}
          onPress={onHeartPress}
          accessibilityLabel="Open wishlist">
          <Icon
            name="heart-outline"
            size={24}
            color={iconColor}
          />
        </TouchableOpacity>

      </View>
      </View>

      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <View style={styles.menuOverlay}>
          <View style={[styles.menuDrawer, isDark && styles.menuDrawerDark]}>
            <View style={styles.menuHeader}><Text style={[styles.menuTitle, isDark && styles.menuTitleDark]}>Menu</Text><TouchableOpacity onPress={() => setMenuVisible(false)} accessibilityLabel="Close menu"><Icon name="close" size={23} color={iconColor} /></TouchableOpacity></View>
            <MenuItem icon="search-outline" label="Saved Searches" onPress={() => selectMenuItem(onSavedSearchesPress)} />
            <MenuItem icon="settings-outline" label="Settings" onPress={() => selectMenuItem(onSettingsPress)} />
            <MenuItem icon="help-circle-outline" label="Help & Support" onPress={() => selectMenuItem(onHelpPress)} />
            <View style={styles.menuDivider} />
            <MenuItem icon="log-out-outline" label="Log Out" destructive onPress={() => selectMenuItem(onLogoutPress)} />
          </View>
          <TouchableOpacity style={styles.menuBackdrop} activeOpacity={1} onPress={() => setMenuVisible(false)} />
        </View>
      </Modal>
    </>
  );
};

const MenuItem = ({icon, label, destructive, onPress}) => <TouchableOpacity style={styles.menuItem} onPress={onPress} accessibilityRole="button"><View style={[styles.menuIcon, destructive && styles.menuIconDestructive]}><Icon name={icon} size={21} color={destructive ? '#ef4444' : '#334155'} /></View><Text style={[styles.menuItemText, destructive && styles.menuItemTextDestructive]}>{label}</Text><Icon name="chevron-forward" size={18} color={colors.textMuted} /></TouchableOpacity>;

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
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
  containerDark: {backgroundColor: '#1f2937'},

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
  },
  menuOverlay: {flex: 1, flexDirection: 'row'},
  menuBackdrop: {flex: 1, backgroundColor: 'rgba(0,0,0,0.35)'},
  menuDrawer: {width: '78%', height: '100%', paddingTop: 52, backgroundColor: colors.surface, elevation: 12},
  menuDrawerDark: {backgroundColor: '#1f2937'},
  menuTitleDark: {color: '#f8fafc'},
  menuHeader: {paddingHorizontal: 20, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.border},
  menuTitle: {fontSize: 22, fontWeight: '800', color: colors.text},
  menuItem: {height: 62, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center'},
  menuIcon: {width: 36, height: 36, borderRadius: 10, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center'},
  menuIconDestructive: {backgroundColor: '#fff1f2'},
  menuItemText: {flex: 1, marginLeft: 12, fontSize: 15, fontWeight: '600', color: colors.text},
  menuItemTextDestructive: {color: '#ef4444'},
  menuDivider: {height: 1, marginHorizontal: 20, backgroundColor: colors.surfaceMuted},

});
