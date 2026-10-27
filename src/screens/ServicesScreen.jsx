import {useThemeStyles} from '../theme/colors';
import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('window');

const serviceShops = [
  {id: '1', name: 'Gadi Dekho Auto Care', address: 'Baner Road, Pune', phone: '+91 98765 43210', email: 'baner@gadidekho.com', website: 'www.gadidekho.com', services: ['Washing', 'Servicing'], image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=800&auto=format&fit=crop'},
  {id: '2', name: 'City Car Service', address: 'Wakad, Pune', phone: '+91 98765 43211', email: 'wakad@gadidekho.com', website: 'www.gadidekho.com', services: ['Washing', 'Servicing'], image: 'https://images.unsplash.com/photo-1632823471565-1ecdf5c6d7f7?q=80&w=800&auto=format&fit=crop'},
  {id: '3', name: 'Premium Vehicle Care', address: 'Hinjewadi Phase 1, Pune', phone: '+91 98765 43212', email: 'hinjewadi@gadidekho.com', website: 'www.gadidekho.com', services: ['Washing', 'Servicing'], image: 'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?q=80&w=800&auto=format&fit=crop'},
  {id: '4', name: 'Express Auto Garage', address: 'Aundh, Pune', phone: '+91 98765 43213', email: 'aundh@gadidekho.com', website: 'www.gadidekho.com', services: ['Washing', 'Servicing'], image: 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?q=80&w=800&auto=format&fit=crop'},
];

const banners = [
  {id: '1', image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=1200&auto=format&fit=crop', title: 'Complete Vehicle Care', subtitle: 'Washing, servicing and trusted support'},
  {id: '2', image: 'https://images.unsplash.com/photo-1632823471565-1ecdf5c6d7f7?q=80&w=1200&auto=format&fit=crop', title: 'Professional Servicing', subtitle: 'Keep your vehicle running smoothly'},
  {id: '3', image: 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?q=80&w=1200&auto=format&fit=crop', title: 'Premium Car Washing', subtitle: 'Clean care for every vehicle'},
];

const ServicesScreen = ({navigation}) => {
  const {colors, styles} = useThemeStyles(createStyles);

  const insets = useSafeAreaInsets();
  const sliderRef = useRef(null);
  const [activeBanner, setActiveBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (activeBanner + 1) % banners.length;
      sliderRef.current?.scrollToIndex({index: nextIndex, animated: true});
    }, 3500);
    return () => clearInterval(timer);
  }, [activeBanner]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, {paddingTop: insets.top + 10}]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} accessibilityLabel="Go back">
          <Icon name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View><Text style={styles.heading}>Services</Text><Text style={styles.headerSubtitle}>Trusted vehicle care near you</Text></View>
      </View>

      <FlatList
        data={serviceShops}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        ListHeaderComponent={(
          <>
            <FlatList
              ref={sliderRef}
              data={banners}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              onMomentumScrollEnd={event => setActiveBanner(Math.round(event.nativeEvent.contentOffset.x / width))}
              renderItem={({item}) => <View style={styles.banner}><Image source={{uri: item.image}} style={styles.bannerImage} /><View style={styles.overlay} /><View style={styles.bannerText}><Text style={styles.bannerTitle}>{item.title}</Text><Text style={styles.bannerSubtitle}>{item.subtitle}</Text></View></View>}
            />
            <View style={styles.dots}>{banners.map((item, index) => <View key={item.id} style={[styles.dot, activeBanner === index && styles.activeDot]} />)}</View>
            <Text style={styles.sectionTitle}>Service centres near you</Text>
          </>
        )}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Image source={{uri: item.image}} style={styles.shopImage} />
            <View style={styles.cardContent}>
              <Text style={styles.shopName}>{item.name}</Text>
              <View style={styles.addressRow}><Icon name="location-outline" size={14} color={colors.textMuted} /><Text style={styles.address}>{item.address}</Text></View>
              <View style={styles.chips}>{item.services.map(service => <View key={service} style={styles.chip}><Text style={styles.chipText}>{service}</Text></View>)}</View>
              <TouchableOpacity accessibilityRole="button" style={styles.detailsButton} onPress={() => navigation.navigate('ServiceDetails', {item})}>
                <Text style={styles.detailsText}>View Details</Text><Icon name="chevron-forward" size={15} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default ServicesScreen;

const createStyles = colors => StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  header: {paddingHorizontal: 15, paddingBottom: 14, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', gap: 12},
  backButton: {width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center'},
  heading: {fontSize: 20, fontWeight: '800', color: colors.text},
  headerSubtitle: {fontSize: 12, color: colors.textMuted, marginTop: 3},
  list: {paddingBottom: 30},
  banner: {width, height: 190, paddingHorizontal: 14, paddingTop: 14},
  bannerImage: {width: width - 28, height: 176, borderRadius: 18, resizeMode: 'cover'},
  overlay: {position: 'absolute', left: 14, right: 14, top: 14, height: 176, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.45)'},
  bannerText: {position: 'absolute', left: 34, right: 30, top: 63},
  bannerTitle: {fontSize: 24, fontWeight: '900', color: '#fff'},
  bannerSubtitle: {fontSize: 13, lineHeight: 20, color: '#fff', marginTop: 7},
  dots: {flexDirection: 'row', justifyContent: 'center', marginTop: 4, marginBottom: 8},
  dot: {width: 7, height: 7, marginHorizontal: 4, borderRadius: 4, backgroundColor: colors.textMuted},
  activeDot: {width: 18, backgroundColor: '#ef4444'},
  sectionTitle: {fontSize: 20, fontWeight: '800', color: colors.text, marginHorizontal: 14, marginTop: 8, marginBottom: 12},
  row: {justifyContent: 'space-between', paddingHorizontal: 14},
  card: {width: '48%', marginBottom: 14, padding: 10, borderRadius: 15, backgroundColor: colors.surface, elevation: 2},
  shopImage: {width: '100%', height: 110, borderRadius: 11, backgroundColor: colors.surfaceMuted},
  cardContent: {marginTop: 10},
  shopName: {minHeight: 38, fontSize: 14, fontWeight: '800', color: colors.text},
  addressRow: {flexDirection: 'row', alignItems: 'center', marginTop: 7},
  address: {flex: 1, minHeight: 28, marginLeft: 4, fontSize: 10, color: colors.textMuted},
  chips: {flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10},
  chip: {paddingHorizontal: 8, paddingVertical: 5, borderRadius: 6, backgroundColor: colors.accentSurface},
  chipText: {fontSize: 10, fontWeight: '700', color: '#ef4444'},
  detailsButton: {height: 36, marginTop: 12, borderRadius: 8, backgroundColor: '#ef4444', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'},
  detailsText: {fontSize: 11, fontWeight: '800', color: '#fff', marginRight: 4},
});
