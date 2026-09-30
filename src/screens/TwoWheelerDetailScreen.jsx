import {colors} from '../theme/colors';
import React, {useRef, useState} from 'react';
import {Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import NetworkVehicleImage from '../components/NetworkVehicleImage';

const BIKE_FALLBACK = 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1000&auto=format&fit=crop';
const CAR_FALLBACK = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000&auto=format&fit=crop';
const OTHER_FALLBACK = 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=1000&auto=format&fit=crop';
const {width: screenWidth} = Dimensions.get('window');

const Spec = ({icon, value, label}) => (
  <View style={styles.specCard}>
    <Icon name={icon} size={19} color={colors.text} />
    <Text style={styles.specValue}>{value}</Text>
    <Text style={styles.specLabel}>{label}</Text>
  </View>
);

const KeySpec = ({icon, label, value}) => (
  <View style={styles.keySpec}>
    <Icon name={icon} size={16} color="#475569" />
    <View style={styles.keyCopy}><Text style={styles.keyLabel}>{label}</Text><Text style={styles.keyValue}>{value}</Text></View>
  </View>
);

const Feature = ({icon, label}) => (
  <View style={styles.feature}>
    <View style={styles.featureIcon}><Icon name={icon} size={18} color={colors.text} /></View>
    <Text style={styles.featureText}>{label}</Text>
  </View>
);

const StatusCard = ({icon, title, value, color}) => (
  <View style={styles.statusCard}>
    <View style={[styles.statusIcon, {backgroundColor: `${color}18`}]}><Icon name={icon} size={20} color={color} /></View>
    <View><Text style={styles.statusTitle}>{title}</Text><Text style={styles.statusValue}>{value} <Icon name="checkmark-circle" size={12} color="#16a34a" /></Text></View>
  </View>
);

const TwoWheelerDetailScreen = ({navigation, route}) => {
  const galleryRef = useRef(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const item = route.params?.item || {};
  const isOther = route.params?.vehicleType === 'other';
  const isCar = route.params?.vehicleType === '4wheeler';
  const title = item.title || (isOther ? 'Other Vehicle' : isCar ? 'Four Wheeler' : 'Two Wheeler');
  const numericPrice = typeof item.price === 'number' ? item.price : Number(String(item.price || '').replace(/[^0-9]/g, ''));
  const price = numericPrice ? `₹ ${numericPrice.toLocaleString('en-IN')}` : '₹ 1,05,000';
  const fallbackImage = isOther ? OTHER_FALLBACK : isCar ? CAR_FALLBACK : BIKE_FALLBACK;
  const mainImage = item.image || fallbackImage;
  const gallery = isOther
    ? [mainImage, OTHER_FALLBACK, 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=900&auto=format&fit=crop', 'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?q=80&w=900&auto=format&fit=crop']
    : isCar
    ? [mainImage, CAR_FALLBACK, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=900&auto=format&fit=crop', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=900&auto=format&fit=crop']
    : [mainImage, BIKE_FALLBACK, 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=700&auto=format&fit=crop', 'https://images.unsplash.com/photo-1524591652733-73fa1ae7b5ee?q=80&w=700&auto=format&fit=crop'];
  const recommendationTitles = isOther ? ['Eicher Pro 3016', 'Tata 407 Gold', 'Ashok Leyland Dost+'] : isCar ? ['Hyundai i20 2024', 'Tata Nexon 2024', 'Honda City 2024'] : ['TVS Apache RTR 160', 'Yamaha FZ-S V4', 'Honda SP 125'];
  const recommendationPrices = isOther ? ['26,50,000', '28,90,000', '7,20,000'] : isCar ? ['7,20,000', '8,00,000', '12,50,000'] : ['1,12,000', '1,18,000', '92,000'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}><Icon name="arrow-back" size={23} color={colors.text} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Gadi Dekho</Text>
        <View style={styles.headerActions}><TouchableOpacity style={styles.headerButton}><Icon name="heart-outline" size={23} color={colors.text} /></TouchableOpacity><TouchableOpacity style={styles.headerButton}><Icon name="share-social-outline" size={22} color={colors.text} /></TouchableOpacity></View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageWrap}>
          <View style={styles.stockBadge}><Text style={styles.stockText}>In Stock</Text></View>
          <View style={styles.imageCount}><Text style={styles.imageCountText}>{selectedImageIndex + 1} / {gallery.length}</Text></View>
          <FlatList
            ref={galleryRef}
            data={gallery}
            horizontal
            pagingEnabled
            bounces={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(image, index) => `${image}-${index}`}
            renderItem={({item: image}) => <NetworkVehicleImage uri={image} fallbackUri={fallbackImage} style={styles.heroImage} />}
            onMomentumScrollEnd={event => setSelectedImageIndex(Math.round(event.nativeEvent.contentOffset.x / screenWidth))}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gallery}>{gallery.map((image, index) => <TouchableOpacity key={`${image}-${index}`} activeOpacity={0.8} style={[styles.thumbWrap, index === selectedImageIndex && styles.thumbActive]} onPress={() => {setSelectedImageIndex(index); galleryRef.current?.scrollToIndex({index, animated: true});}}><NetworkVehicleImage uri={image} fallbackUri={fallbackImage} style={styles.thumb} /></TouchableOpacity>)}</ScrollView>

        <View style={styles.section}>
          <Text style={styles.title}>{title} <Icon name="checkmark-circle" size={17} color="#2563eb" /></Text>
          <Text style={styles.subline}>{isOther ? `${item.type || 'Commercial'} • ${item.fuel || 'Diesel'} • Manual` : isCar ? `${item.category || item.bodyType || 'Hatchback'} • ${item.fuel || 'Petrol'} • ${item.transmission || 'Manual'}` : 'Single Disc • BS6 • Manual'}</Text>
          <Text style={styles.price}>{price}</Text>
          <View style={styles.locationRow}><Icon name="location-outline" size={14} color={colors.textMuted} /><Text style={styles.locationText}>Pune, Maharashtra</Text></View>
        </View>

        <View style={styles.specGrid}>
          <Spec icon="speedometer-outline" value={isOther ? '1,25,000 km' : isCar ? '12,500 km' : '15,200 km'} label="KILOMETERS" /><Spec icon="calendar-outline" value={String(item.year || 2024)} label="REG. YEAR" /><Spec icon="flash-outline" value={item.fuel || (isOther ? 'Diesel' : 'Petrol')} label="FUEL TYPE" /><Spec icon="person-outline" value="1st Owner" label="OWNER" />
          <Spec icon="git-compare-outline" value={item.transmission || 'Manual'} label="TRANSMISSION" /><Spec icon="shield-checkmark-outline" value="BS6" label="EMISSION" /><Spec icon="speedometer-outline" value={isOther ? '4970 cc' : isCar ? '1197 cc' : '150 cc'} label="ENGINE CC" /><Spec icon={isOther ? 'bus-outline' : isCar ? 'car-sport-outline' : 'bicycle-outline'} value={item.type || item.category || item.bodyType || (isCar ? 'Hatchback' : 'Bike')} label="BODY TYPE" />
        </View>

        <View style={styles.section}><Text style={styles.sectionTitle}>About This {isOther ? 'Vehicle' : isCar ? 'Car' : 'Bike'}</Text><Text style={styles.about}>Well maintained {title}, single owner, all service done on time. Excellent condition with clean documents and smooth performance.</Text></View>
        <View style={styles.section}><Text style={styles.sectionTitle}>Key Specifications</Text><View style={styles.keyGrid}>{isOther ? <><KeySpec icon="settings-outline" label="Engine" value="4970 cc" /><KeySpec icon="leaf-outline" label="Emission Norm" value="BS6" /><KeySpec icon="flash-outline" label="Power" value="215 HP" /><KeySpec icon="bus-outline" label="Body Type" value={item.type || 'Commercial'} /><KeySpec icon="people-outline" label="Seating Capacity" value="36 Seater" /><KeySpec icon="resize-outline" label="Wheelbase" value="5670 mm" /></> : isCar ? <><KeySpec icon="settings-outline" label="Engine" value="1197 cc" /><KeySpec icon="water-outline" label="Fuel Tank Capacity" value="37 Litres" /><KeySpec icon="flash-outline" label="Power" value="88.5 bhp" /><KeySpec icon="car-sport-outline" label="Boot Space" value="265 Litres" /><KeySpec icon="speedometer-outline" label="Mileage" value="22.38 km/l" /><KeySpec icon="people-outline" label="Seating Capacity" value="5 Seater" /></> : <><KeySpec icon="settings-outline" label="Engine" value="149.5 cc" /><KeySpec icon="apps-outline" label="Cylinders" value="1" /><KeySpec icon="flash-outline" label="Power" value="18.5 PS" /><KeySpec icon="water-outline" label="Fuel Tank Capacity" value="15 Litres" /><KeySpec icon="speedometer-outline" label="Mileage" value="45 km/l" /><KeySpec icon="resize-outline" label="Seat Height" value="780 mm" /></>}</View><TouchableOpacity style={styles.viewSpecs}><Text style={styles.viewSpecsText}>View All Specifications</Text><Icon name="chevron-forward" size={14} color="#2563eb" /></TouchableOpacity></View>
        <View style={styles.section}><Text style={styles.sectionTitle}>Top Features</Text><View style={styles.features}>{isOther ? <><Feature icon="navigate-outline" label="Power Steering" /><Feature icon="shield-outline" label="ABS" /><Feature icon="camera-outline" label="Reverse Camera" /><Feature icon="location-outline" label="GPS Tracking" /><Feature icon="snow-outline" label="Air Conditioning" /></> : isCar ? <><Feature icon="phone-portrait-outline" label="Touchscreen" /><Feature icon="logo-apple" label="Apple CarPlay" /><Feature icon="shield-outline" label="ABS with EBD" /><Feature icon="layers-outline" label="Dual Airbags" /><Feature icon="camera-outline" label="Rear Sensors" /></> : <><Feature icon="speedometer-outline" label="Digital Console" /><Feature icon="flash-outline" label="Electric Start" /><Feature icon="disc-outline" label="Tubeless Tyres" /><Feature icon="battery-charging-outline" label="LED DRLs" /><Feature icon="leaf-outline" label="Engine Kill Switch" /></>}</View></View>

        <View style={styles.section}><View style={styles.statusRow}><StatusCard icon="shield-checkmark-outline" title="RC Status" value="Active" color="#16a34a" /><StatusCard icon="shield-outline" title="Insurance Valid" value="Till Mar 2025" color="#2563eb" /><StatusCard icon="construct-outline" title="Service Record" value="Available" color="#9333ea" /></View></View>
        <View style={styles.section}><Text style={styles.sectionTitle}>About Seller</Text><TouchableOpacity style={styles.sellerRow}><View style={styles.avatar}><Text style={styles.avatarText}>{isOther ? 'DW' : 'RW'}</Text></View><View style={styles.sellerCopy}><Text style={styles.sellerName}>{isOther ? 'Dream Wheels' : 'Royal Wheels'}</Text><Text style={styles.rating}>★ 4.5  <Text style={styles.muted}>(86 Reviews)</Text></Text><Text style={styles.muted}>{isOther ? '35 Commercial Vehicles Listed' : `18 ${isCar ? 'Four' : 'Two'} Wheelers Listed`}  •  Member since 2020</Text></View><Icon name="chevron-forward" size={22} color={colors.text} /></TouchableOpacity></View>
        <View style={styles.section}><Text style={styles.sectionTitle}>Location</Text><View style={styles.mapWrap}><NetworkVehicleImage uri="https://staticmap.openstreetmap.de/staticmap.php?center=18.5204,73.8567&zoom=12&size=700x220&markers=18.5204,73.8567,red-pushpin" fallbackUri="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=900&auto=format&fit=crop" style={styles.map} /><View style={styles.pin}><Icon name="location" size={32} color="#ef4444" /></View></View><View style={styles.mapFooter}><Text style={styles.mapLocation}>Pune, Maharashtra</Text><Text style={styles.mapLink}>View on Map  ›</Text></View></View>
        <View style={styles.enquireCard}><View><Text style={styles.enquireTitle}>Want to know more?</Text><Text style={styles.muted}>Ask the seller for more details.</Text></View><TouchableOpacity style={styles.enquireButton}><Text style={styles.enquireButtonText}>Enquire Now</Text></TouchableOpacity></View>
        <View style={styles.section}><View style={styles.recommendHeader}><Text style={styles.sectionTitle}>You May Also Like</Text><Text style={styles.mapLink}>View All</Text></View><ScrollView horizontal showsHorizontalScrollIndicator={false}>{gallery.slice(1).map((image, index) => <View key={image} style={styles.recommendCard}><NetworkVehicleImage uri={image} fallbackUri={fallbackImage} style={styles.recommendImage} /><Text style={styles.recommendTitle}>{recommendationTitles[index]}</Text><Text style={styles.recommendPrice}>₹ {recommendationPrices[index]}</Text></View>)}</ScrollView></View>
      </ScrollView>

      <View style={styles.bottomBar}><TouchableOpacity style={styles.callButton}><Icon name="call-outline" size={17} color="#ef4444" /><Text style={styles.callText}>Call Seller</Text></TouchableOpacity><TouchableOpacity style={styles.whatsappButton}><Icon name="logo-whatsapp" size={18} color="#16a34a" /><Text style={styles.whatsappText}>WhatsApp</Text></TouchableOpacity><TouchableOpacity style={styles.primaryButton}><Icon name="chatbubble-outline" size={17} color="#fff" /><Text style={styles.primaryText}>Enquire Now</Text></TouchableOpacity></View>
    </SafeAreaView>
  );
};

export default TwoWheelerDetailScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background}, scrollContent: {paddingBottom: 88}, header: {height: 58, paddingHorizontal: 8, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border}, headerButton: {width: 42, height: 42, alignItems: 'center', justifyContent: 'center'}, headerTitle: {flex: 1, textAlign: 'center', fontSize: 21, fontWeight: '900', color: colors.text}, headerActions: {flexDirection: 'row'}, imageWrap: {height: 260, backgroundColor: colors.surface}, heroImage: {width: screenWidth, height: 260, resizeMode: 'contain'}, stockBadge: {position: 'absolute', top: 10, left: 10, zIndex: 2, backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 6}, stockText: {fontSize: 10, fontWeight: '700', color: '#15803d'}, imageCount: {position: 'absolute', top: 10, right: 10, zIndex: 2, backgroundColor: '#111827cc', paddingHorizontal: 7, paddingVertical: 4, borderRadius: 5}, imageCountText: {fontSize: 10, color: '#fff'}, gallery: {padding: 8, gap: 7, backgroundColor: colors.surface}, thumbWrap: {width: 67, height: 53, borderRadius: 7, borderWidth: 1, borderColor: colors.border, overflow: 'hidden'}, thumbActive: {borderColor: '#ef4444', borderWidth: 2}, thumb: {width: '100%', height: '100%', resizeMode: 'cover'},
  section: {backgroundColor: colors.surface, marginTop: 8, padding: 14}, title: {fontSize: 20, fontWeight: '800', color: colors.text}, subline: {fontSize: 12, color: colors.textMuted, marginTop: 5}, price: {fontSize: 21, fontWeight: '800', color: '#ef4444', marginTop: 10}, locationRow: {flexDirection: 'row', alignItems: 'center', marginTop: 5}, locationText: {fontSize: 11, color: colors.textMuted, marginLeft: 3}, sectionTitle: {fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 12}, about: {fontSize: 12, lineHeight: 19, color: '#475569'}, specGrid: {flexDirection: 'row', flexWrap: 'wrap', backgroundColor: colors.surface, padding: 8, marginTop: 8}, specCard: {width: '25%', minHeight: 82, borderWidth: 0.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', padding: 5}, specValue: {fontSize: 11, fontWeight: '700', color: colors.text, textAlign: 'center', marginTop: 5}, specLabel: {fontSize: 8, color: colors.textMuted, textAlign: 'center', marginTop: 3},
  keyGrid: {flexDirection: 'row', flexWrap: 'wrap'}, keySpec: {width: '50%', flexDirection: 'row', alignItems: 'center', paddingVertical: 8}, keyCopy: {marginLeft: 8}, keyLabel: {fontSize: 10, color: colors.textMuted}, keyValue: {fontSize: 11, fontWeight: '700', color: colors.text, marginTop: 2}, viewSpecs: {marginTop: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}, viewSpecsText: {fontSize: 11, fontWeight: '700', color: '#2563eb'}, features: {flexDirection: 'row', justifyContent: 'space-between'}, feature: {width: '19%', alignItems: 'center'}, featureIcon: {width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center'}, featureText: {fontSize: 8, color: colors.text, textAlign: 'center', marginTop: 6},
  statusRow: {flexDirection: 'row', gap: 7}, statusCard: {flex: 1, minHeight: 70, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 8, flexDirection: 'row', alignItems: 'center'}, statusIcon: {width: 31, height: 31, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 6}, statusTitle: {fontSize: 9, fontWeight: '700', color: colors.text}, statusValue: {fontSize: 8, color: colors.textMuted, marginTop: 3}, sellerRow: {flexDirection: 'row', alignItems: 'center'}, avatar: {width: 48, height: 48, borderRadius: 24, backgroundcolor: colors.text, alignItems: 'center', justifyContent: 'center'}, avatarText: {fontSize: 15, fontWeight: '800', color: '#ef4444'}, sellerCopy: {flex: 1, marginLeft: 11}, sellerName: {fontSize: 14, fontWeight: '800', color: colors.text}, rating: {fontSize: 11, color: '#f59e0b', marginVertical: 4}, muted: {fontSize: 10, color: colors.textMuted}, mapWrap: {height: 130, borderRadius: 10, overflow: 'hidden'}, map: {width: '100%', height: '100%', resizeMode: 'cover'}, pin: {position: 'absolute', top: 45, left: '46%'}, mapFooter: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}, mapLocation: {fontSize: 12, fontWeight: '700', color: colors.text}, mapLink: {fontSize: 11, fontWeight: '700', color: '#2563eb'}, enquireCard: {margin: 8, padding: 14, borderRadius: 12, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, enquireTitle: {fontSize: 13, fontWeight: '800', color: colors.text, marginBottom: 4}, enquireButton: {backgroundColor: '#ef4444', borderRadius: 8, paddingHorizontal: 17, paddingVertical: 12}, enquireButtonText: {fontSize: 12, fontWeight: '700', color: '#fff'}, recommendHeader: {flexDirection: 'row', justifyContent: 'space-between'}, recommendCard: {width: 150, marginRight: 10, padding: 8, borderWidth: 1, borderColor: colors.border, borderRadius: 10}, recommendImage: {width: '100%', height: 90, resizeMode: 'cover', borderRadius: 8}, recommendTitle: {fontSize: 11, fontWeight: '700', color: colors.text, marginTop: 7}, recommendPrice: {fontSize: 12, fontWeight: '800', color: '#ef4444', marginTop: 5},
  bottomBar: {position: 'absolute', left: 0, right: 0, bottom: 0, height: 72, paddingHorizontal: 8, paddingVertical: 10, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, flexDirection: 'row', gap: 7}, callButton: {flex: 1, borderWidth: 1, borderColor: '#ef4444', borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, callText: {fontSize: 11, fontWeight: '700', color: '#ef4444', marginLeft: 5}, whatsappButton: {flex: 1, borderWidth: 1, borderColor: '#16a34a', borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, whatsappText: {fontSize: 11, fontWeight: '700', color: '#16a34a', marginLeft: 5}, primaryButton: {flex: 1.25, backgroundColor: '#ef4444', borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, primaryText: {fontSize: 11, fontWeight: '700', color: '#fff', marginLeft: 5},
});
