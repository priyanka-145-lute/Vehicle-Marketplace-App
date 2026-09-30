import {colors} from '../theme/colors';
import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const NOTIFICATIONS = [
  {id: '1', icon: 'pricetag-outline', color: '#ef4444', title: 'New sale is live', message: 'Save up to 30% on selected vehicle parts.', time: 'Just now', unread: true},
  {id: '2', icon: 'car-sport-outline', color: '#2563eb', title: 'New vehicles added', message: 'Fresh two wheeler and four wheeler listings are ready to explore.', time: 'Today', unread: true},
  {id: '3', icon: 'heart-outline', color: '#ec4899', title: 'Wishlist reminder', message: 'Your saved vehicles are waiting for you.', time: 'Yesterday', unread: false},
  {id: '4', icon: 'shield-checkmark-outline', color: '#16a34a', title: 'Welcome to Gadi Dekho', message: 'Browse vehicles, compare options and find the right deal.', time: '2 days ago', unread: false},
];

const NotificationsScreen = ({navigation}) => (
  <SafeAreaView style={styles.container} edges={['top']}>
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} accessibilityLabel="Go back">
        <Icon name="chevron-back" size={24} color={colors.text} />
      </TouchableOpacity>
      <Text style={styles.heading}>Notifications</Text>
      <View style={styles.headerSpacer} />
    </View>
    <FlatList
      data={NOTIFICATIONS}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
      renderItem={({item}) => (
        <View style={[styles.card, item.unread && styles.unreadCard]}>
          <View style={[styles.iconCircle, {backgroundColor: `${item.color}18`}]}>
            <Icon name={item.icon} size={22} color={item.color} />
          </View>
          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{item.title}</Text>
              {item.unread ? <View style={styles.unreadDot} /> : null}
            </View>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        </View>
      )}
    />
  </SafeAreaView>
);

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  header: {height: 68, paddingHorizontal: 15, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  backButton: {width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center'},
  heading: {fontSize: 20, fontWeight: '800', color: colors.text},
  headerSpacer: {width: 42},
  list: {padding: 14, gap: 10},
  card: {padding: 14, borderRadius: 16, backgroundColor: colors.surface, flexDirection: 'row', elevation: 1},
  unreadCard: {borderWidth: 1, borderColor: '#fee2e2', backgroundColor: '#fffafa'},
  iconCircle: {width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center'},
  content: {flex: 1, marginLeft: 12},
  titleRow: {flexDirection: 'row', alignItems: 'center'},
  title: {flex: 1, fontSize: 15, fontWeight: '800', color: colors.text},
  unreadDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444'},
  message: {fontSize: 13, color: colors.textMuted, lineHeight: 19, marginTop: 4},
  time: {fontSize: 11, color: colors.textMuted, marginTop: 7},
});
