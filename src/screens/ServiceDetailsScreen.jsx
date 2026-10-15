import {colors} from '../theme/colors';
import React, {useState} from 'react';
import {Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const ServiceDetailsScreen = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Overview');
  const item = route.params?.item || {};
  const services = item.services || [];
  const phone = item.phone || '';
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address || '')}`;
  const availableServices = [...new Set([...services, 'Oil Change', 'Wheel Alignment', 'Interior Cleaning', 'Battery Check'])];
  const galleryImages = [
    item.image,
    'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1632823471565-1ecdf5c6d7f7?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?q=80&w=800&auto=format&fit=crop',
  ].filter(Boolean);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrap}>
          <Image source={{uri: item.image}} style={styles.heroImage} />
          <TouchableOpacity style={[styles.backButton, {top: insets.top + 10}]} onPress={() => navigation.goBack()} accessibilityLabel="Go back">
            <Icon name="chevron-back" size={24} color="#111827" />
          </TouchableOpacity>
        </View>

        <View style={styles.sheet}>
          <View style={styles.summary}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.metaRow}><Icon name="star" size={15} color="#f59e0b" /><Text style={styles.meta}>4.7 (98 reviews)</Text><Text style={styles.dot}>•</Text><Text style={styles.meta}>{item.address}</Text></View>
            <View style={styles.chips}>{services.map(service => <View key={service} style={styles.chip}><Text style={styles.chipText}>{service}</Text></View>)}</View>
          </View>

          <View style={styles.tabs}>
            {['Overview', 'Contact'].map(tab => (
              <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.activeTab]} onPress={() => setActiveTab(tab)}>
                <Icon name={tab === 'Overview' ? 'information-circle-outline' : 'call-outline'} size={18} color={activeTab === tab ? '#ef4444' : colors.textMuted} />
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === 'Overview' ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About {item.name}</Text>
              <Text style={styles.body}>{item.name} provides trusted vehicle washing and servicing in {item.address}. Experienced professionals take care of routine maintenance, cleaning and general vehicle inspection.</Text>

              <Text style={styles.sectionTitle}>Available Services</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
                {availableServices.map(service => (
                  <View key={service} style={styles.serviceCard}>
                    <View style={styles.serviceIcon}><Icon name={service === 'Washing' ? 'water-outline' : 'construct-outline'} size={23} color="#ef4444" /></View>
                    <Text style={styles.serviceName}>{service}</Text>
                  </View>
                ))}
              </ScrollView>

              <Text style={styles.galleryTitle}>Our Work</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
                {galleryImages.map((image, index) => <Image key={`${image}-${index}`} source={{uri: image}} style={styles.galleryImage} />)}
              </ScrollView>
            </View>
          ) : (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <ContactRow icon="location-outline" label="Address" value={item.address} onPress={() => Linking.openURL(directionsUrl)} />
              <ContactRow icon="call-outline" label="Call Us" value={phone} onPress={() => Linking.openURL(`tel:${phone.replace(/\s/g, '')}`)} />
              <ContactRow icon="logo-whatsapp" label="WhatsApp" value={phone} onPress={() => Linking.openURL(`https://wa.me/${phone.replace(/\D/g, '')}`)} />
              <ContactRow icon="mail-outline" label="Email" value={item.email} onPress={() => Linking.openURL(`mailto:${item.email}`)} />
              <ContactRow icon="globe-outline" label="Website" value={item.website} onPress={() => Linking.openURL(`https://${item.website}`)} />
              <TouchableOpacity style={styles.locationCard} onPress={() => Linking.openURL(directionsUrl)} accessibilityRole="button">
                <Text style={styles.locationText}>{item.address}</Text>
                <Icon name="location" size={24} color="#ef4444" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.directionsButton} onPress={() => Linking.openURL(directionsUrl)} accessibilityRole="button">
                <Icon name="navigate" size={15} color="#ef4444" />
                <Text style={styles.directionsText}>Get Directions</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const ContactRow = ({icon, label, value, onPress}) => (
  <TouchableOpacity style={styles.contactRow} onPress={onPress} accessibilityRole="button">
    <View style={styles.contactIcon}><Icon name={icon} size={20} color="#ef4444" /></View>
    <View style={styles.contactCopy}><Text style={styles.contactLabel}>{label}</Text><Text style={styles.contactValue}>{value}</Text></View>
    <Icon name="chevron-forward" size={18} color="#ef4444" />
  </TouchableOpacity>
);

export default ServiceDetailsScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  imageWrap: {height: 260, backgroundColor: colors.surfaceMuted},
  heroImage: {width: '100%', height: '100%', resizeMode: 'cover'},
  backButton: {position: 'absolute', left: 16, width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center'},
  sheet: {marginTop: -24, paddingBottom: 30, borderTopLeftRadius: 26, borderTopRightRadius: 26, backgroundColor: colors.surface, overflow: 'hidden'},
  summary: {paddingHorizontal: 18, paddingTop: 24, paddingBottom: 16},
  name: {fontSize: 23, fontWeight: '900', color: colors.text},
  metaRow: {flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: 9},
  meta: {fontSize: 12, color: colors.textMuted, marginLeft: 4},
  dot: {fontSize: 12, color: colors.textMuted, marginHorizontal: 7},
  chips: {flexDirection: 'row', gap: 7, marginTop: 12},
  chip: {paddingHorizontal: 9, paddingVertical: 5, borderRadius: 6, backgroundColor: '#fff1f2'},
  chipText: {fontSize: 10, fontWeight: '700', color: '#ef4444'},
  tabs: {height: 52, padding: 4, marginHorizontal: 18, borderRadius: 14, backgroundColor: colors.surfaceMuted, flexDirection: 'row'},
  tab: {flex: 1, borderRadius: 11, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center'},
  activeTab: {backgroundColor: '#fff1f2'},
  tabText: {fontSize: 13, fontWeight: '600', color: colors.textMuted},
  activeTabText: {color: '#ef4444'},
  section: {paddingHorizontal: 18, paddingTop: 20},
  sectionTitle: {fontSize: 17, fontWeight: '800', color: colors.text, marginBottom: 12, marginTop: 5},
  body: {fontSize: 13, lineHeight: 21, color: colors.textMuted, marginBottom: 18},
  horizontalList: {gap: 10, paddingRight: 18, paddingBottom: 4},
  serviceCard: {width: 112, minHeight: 112, padding: 12, borderRadius: 16, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center'},
  serviceIcon: {width: 40, height: 40, borderRadius: 12, backgroundColor: '#fff1f2', alignItems: 'center', justifyContent: 'center'},
  serviceName: {fontSize: 12, lineHeight: 16, fontWeight: '700', color: colors.text, textAlign: 'center', marginTop: 9},
  galleryTitle: {fontSize: 17, fontWeight: '800', color: colors.text, marginBottom: 12, marginTop: 22},
  galleryImage: {width: 170, height: 110, borderRadius: 14, backgroundColor: colors.surfaceMuted},
  contactRow: {minHeight: 76, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', alignItems: 'center'},
  contactIcon: {width: 42, height: 42, borderRadius: 12, backgroundColor: '#fff1f2', alignItems: 'center', justifyContent: 'center'},
  contactCopy: {flex: 1, marginHorizontal: 12},
  contactLabel: {fontSize: 12, fontWeight: '800', color: colors.text},
  contactValue: {fontSize: 12, lineHeight: 18, color: colors.textMuted, marginTop: 4},
  locationCard: {height: 112, marginTop: 18, borderRadius: 14, backgroundColor: '#edf7f1', alignItems: 'center', justifyContent: 'center', gap: 12},
  locationText: {fontSize: 13, fontWeight: '700', color: '#4b715b'},
  directionsButton: {height: 44, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center'},
  directionsText: {fontSize: 12, fontWeight: '800', color: '#ef4444'},
});
