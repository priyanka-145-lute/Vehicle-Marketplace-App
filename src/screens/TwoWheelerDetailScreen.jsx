import {useThemeStyles} from '../theme/colors';
import React, {useRef, useState} from 'react';
import {Alert, Dimensions, FlatList, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import NetworkVehicleImage from '../components/NetworkVehicleImage';
import {CARS, OTHER_VEHICLES, TWO_WHEELERS} from '../data/vehicleCatalog';
import {getWishlistKey} from '../context/WishlistContext';

const CATALOGS = {'2wheeler': TWO_WHEELERS, '4wheeler': CARS, other: OTHER_VEHICLES};
const {width: screenWidth} = Dimensions.get('window');

const Spec = ({icon, value, label}) => {
  const {colors, styles} = useThemeStyles(createStyles);
  return (<View style={styles.specCard}>
    <Icon name={icon} size={19} color={colors.text} />
    <Text style={styles.specValue}>{value}</Text>
    <Text style={styles.specLabel}>{label}</Text>
  </View>);
};

const KeySpec = ({icon, label, value}) => {
  const {colors, styles} = useThemeStyles(createStyles);
  return (<View style={styles.keySpec}>
    <Icon name={icon} size={16} color={colors.textMuted} />
    <View style={styles.keyCopy}><Text style={styles.keyLabel}>{label}</Text><Text style={styles.keyValue}>{value}</Text></View>
  </View>);
};

const Feature = ({icon, label}) => {
  const {colors, styles} = useThemeStyles(createStyles);
  return (<View style={styles.feature}>
    <View style={styles.featureIcon}><Icon name={icon} size={18} color={colors.text} /></View>
    <Text style={styles.featureText}>{label}</Text>
  </View>);
};

const StatusCard = ({icon, title, value, color}) => {
  const {styles} = useThemeStyles(createStyles);
  return (<View style={styles.statusCard}>
    <View style={[styles.statusIcon, {backgroundColor: `${color}18`}]}><Icon name={icon} size={20} color={color} /></View>
    <View><Text style={styles.statusTitle}>{title}</Text><Text style={styles.statusValue}>{value}</Text></View>
  </View>);
};

const TwoWheelerDetailScreen = ({navigation, route}) => {
  const {colors, styles} = useThemeStyles(createStyles);

  const galleryRef = useRef(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const listing = route.params?.item || {};
  const vehicleType = route.params?.vehicleType || listing.vehicleType || '2wheeler';
  const catalog = CATALOGS[vehicleType] || [];
  const id = getWishlistKey(listing, vehicleType).split(':')[1];
  const item = {...listing, ...catalog.find(vehicle => vehicle.id === id)};
  const isOther = vehicleType === 'other';
  const isCar = vehicleType === '4wheeler';
  const title = item.title || (isOther ? 'Other Vehicle' : isCar ? 'Four Wheeler' : 'Two Wheeler');
  const numericPrice = typeof item.price === 'number' ? item.price : Number(String(item.price || '').replace(/[^0-9]/g, ''));
  const price = numericPrice ? `₹ ${numericPrice.toLocaleString('en-IN')}` : '₹ 1,05,000';
  const gallery = item.image ? [item.image] : [];
  const recommendations = catalog.filter(vehicle => vehicle.id !== item.id).slice(0, 3);
  const location = item.location || 'Location not provided';
  const bodyType = item.bodyType || item.category || item.type || 'Not provided';
  const engineLabel = item.fuel === 'Electric' ? 'POWERTRAIN' : 'ENGINE CC';
  const detailRoute = isOther ? 'OtherVehicleDetail' : isCar ? 'FourWheelerDetail' : 'TwoWheelerDetail';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}><Icon name="arrow-back" size={23} color={colors.text} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Gadi Dekho</Text>
        <View style={styles.headerActions}><TouchableOpacity style={styles.headerButton}><Icon name="heart-outline" size={23} color={colors.text} /></TouchableOpacity><TouchableOpacity style={styles.headerButton}><Icon name="share-social-outline" size={22} color={colors.text} /></TouchableOpacity></View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageWrap}>
          <View style={styles.stockBadge}><Text style={styles.stockText}>{item.isDemo ? "Demo listing" : "Vehicle details"}</Text></View>
          <View style={styles.imageCount}><Text style={styles.imageCountText}>{selectedImageIndex + 1} / {gallery.length}</Text></View>
          <FlatList
            ref={galleryRef}
            data={gallery}
            horizontal
            pagingEnabled
            bounces={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(image, index) => `${image}-${index}`}
            renderItem={({item: image}) => <NetworkVehicleImage uri={image} fallbackUri={item.image} style={styles.heroImage} />}
            onMomentumScrollEnd={event => setSelectedImageIndex(Math.round(event.nativeEvent.contentOffset.x / screenWidth))}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gallery}>{gallery.map((image, index) => <TouchableOpacity key={`${image}-${index}`} activeOpacity={0.8} style={[styles.thumbWrap, index === selectedImageIndex && styles.thumbActive]} onPress={() => {setSelectedImageIndex(index); galleryRef.current?.scrollToIndex({index, animated: true});}}><NetworkVehicleImage uri={image} fallbackUri={item.image} style={styles.thumb} /></TouchableOpacity>)}</ScrollView>

        <View style={styles.section}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subline}>{[bodyType, item.fuel, item.transmission].filter(Boolean).join(" • ")}</Text>
          <Text style={styles.price}>{price}</Text>
          <View style={styles.locationRow}><Icon name="location-outline" size={14} color={colors.textMuted} /><Text style={styles.locationText}>{location}</Text></View>
        </View>

        <View style={styles.specGrid}>
          <Spec icon="speedometer-outline" value={item.usage || "Not provided"} label={item.usageLabel || "KILOMETERS"} /><Spec icon="calendar-outline" value={String(item.year || "Not provided")} label="REG. YEAR" /><Spec icon="flash-outline" value={item.fuel || "Not provided"} label="FUEL TYPE" /><Spec icon="person-outline" value={item.owner || "Not provided"} label="OWNER" />
          <Spec icon="git-compare-outline" value={item.transmission || "Not provided"} label="TRANSMISSION" /><Spec icon="people-outline" value={item.seating || "Not provided"} label="SEATING" /><Spec icon="settings-outline" value={item.engine || "Not provided"} label={engineLabel} /><Spec icon="car-outline" value={bodyType} label="BODY TYPE" />
        </View>

        <View style={styles.section}><Text style={styles.sectionTitle}>About This {isOther ? "Vehicle" : isCar ? "Car" : "Bike"}</Text><Text style={styles.about}>{item.description || "Additional details have not been provided."}</Text></View>
        <View style={styles.section}><Text style={styles.sectionTitle}>Key Specifications</Text><View style={styles.keyGrid}>{(item.specifications || []).map(([label, value]) => <KeySpec key={label} icon="settings-outline" label={label} value={value} />)}</View></View>
        <View style={styles.section}><Text style={styles.sectionTitle}>Top Features</Text><View style={styles.features}>{(item.features || []).map(label => <Feature key={label} icon="checkmark-outline" label={label} />)}</View></View>

        <View style={styles.section}><View style={styles.statusRow}><StatusCard icon="document-text-outline" title="Listing" value={item.isDemo ? "Demo data" : "Vehicle"} color="#2563eb" /><StatusCard icon="calendar-outline" title="Year" value={String(item.year || "Not provided")} color="#9333ea" /><StatusCard icon="person-outline" title="Ownership" value={item.owner || "Not provided"} color="#16a34a" /></View></View>
        <View style={styles.section}><Text style={styles.sectionTitle}>About Seller</Text><View style={styles.sellerRow}><View style={styles.avatar}><Text style={styles.avatarText}>{(item.sellerName || "Seller").charAt(0)}</Text></View><View style={styles.sellerCopy}><Text style={styles.sellerName}>{item.sellerName || "Seller details not provided"}</Text><Text style={styles.muted}>{location}</Text><Text style={styles.muted}>{item.isDemo ? "Sample seller for this demo listing" : ""}</Text></View></View></View>
        <View style={styles.section}><Text style={styles.sectionTitle}>Location</Text>{item.coordinates && <View style={styles.mapWrap}><NetworkVehicleImage uri={"https://staticmap.openstreetmap.de/staticmap.php?center=" + item.coordinates.join(",") + "&zoom=12&size=700x220&markers=" + item.coordinates.join(",") + ",red-pushpin"} style={styles.map} /><View style={styles.pin}><Icon name="location" size={32} color="#ef4444" /></View></View>}<View style={styles.mapFooter}><Text style={styles.mapLocation}>{location}</Text></View></View>
        <View style={styles.enquireCard}><View><Text style={styles.enquireTitle}>Want to know more?</Text><Text style={styles.muted}>Ask the seller for more details.</Text></View><TouchableOpacity style={styles.enquireButton}><Text style={styles.enquireButtonText}>Enquire Now</Text></TouchableOpacity></View>
        <View style={styles.section}><View style={styles.recommendHeader}><Text style={styles.sectionTitle}>You May Also Like</Text></View><ScrollView horizontal showsHorizontalScrollIndicator={false}>{recommendations.map(vehicle => <TouchableOpacity accessibilityRole="button" accessibilityLabel={vehicle.title} key={vehicle.id} style={styles.recommendCard} onPress={() => navigation.push(detailRoute, {item: vehicle, vehicleType})}><NetworkVehicleImage uri={vehicle.image} fallbackUri={vehicle.image} style={styles.recommendImage} /><Text style={styles.recommendTitle}>{vehicle.title}</Text><Text style={styles.recommendPrice}>{"₹ " + vehicle.price.toLocaleString("en-IN")}</Text></TouchableOpacity>)}</ScrollView></View>
      </ScrollView>

      <View style={styles.bottomBar}><TouchableOpacity accessibilityRole="button" onPress={() => Linking.openURL("tel:+918149709394").catch(() => Alert.alert("Could not open the phone dialer."))} style={styles.callButton}><Icon name="call-outline" size={17} color="#ef4444" /><Text style={styles.callText}>Call Seller</Text></TouchableOpacity><TouchableOpacity accessibilityRole="button" onPress={() => Linking.openURL("https://wa.me/918149709394").catch(() => Alert.alert("Could not open WhatsApp."))} style={styles.whatsappButton}><Icon name="logo-whatsapp" size={18} color="#16a34a" /><Text style={styles.whatsappText}>WhatsApp</Text></TouchableOpacity><TouchableOpacity style={styles.primaryButton}><Icon name="chatbubble-outline" size={17} color="#fff" /><Text style={styles.primaryText}>Enquire Now</Text></TouchableOpacity></View>
    </SafeAreaView>
  );
};

export default TwoWheelerDetailScreen;

const createStyles = colors => StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background}, scrollContent: {paddingBottom: 88}, header: {height: 58, paddingHorizontal: 8, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border}, headerButton: {width: 42, height: 42, alignItems: 'center', justifyContent: 'center'}, headerTitle: {flex: 1, textAlign: 'center', fontSize: 21, fontWeight: '900', color: colors.text}, headerActions: {flexDirection: 'row'}, imageWrap: {height: 260, backgroundColor: colors.surface}, heroImage: {width: screenWidth, height: 260, resizeMode: 'contain'}, stockBadge: {position: 'absolute', top: 10, left: 10, zIndex: 2, backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 6}, stockText: {fontSize: 10, fontWeight: '700', color: '#15803d'}, imageCount: {position: 'absolute', top: 10, right: 10, zIndex: 2, backgroundColor: '#111827cc', paddingHorizontal: 7, paddingVertical: 4, borderRadius: 5}, imageCountText: {fontSize: 10, color: '#fff'}, gallery: {padding: 8, gap: 7, backgroundColor: colors.surface}, thumbWrap: {width: 67, height: 53, borderRadius: 7, borderWidth: 1, borderColor: colors.border, overflow: 'hidden'}, thumbActive: {borderColor: '#ef4444', borderWidth: 2}, thumb: {width: '100%', height: '100%', resizeMode: 'cover'},
  section: {backgroundColor: colors.surface, marginTop: 8, padding: 14}, title: {fontSize: 20, fontWeight: '800', color: colors.text}, subline: {fontSize: 12, color: colors.textMuted, marginTop: 5}, price: {fontSize: 21, fontWeight: '800', color: '#ef4444', marginTop: 10}, locationRow: {flexDirection: 'row', alignItems: 'center', marginTop: 5}, locationText: {fontSize: 11, color: colors.textMuted, marginLeft: 3}, sectionTitle: {fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 12}, about: {fontSize: 12, lineHeight: 19, color: colors.textMuted}, specGrid: {flexDirection: 'row', flexWrap: 'wrap', backgroundColor: colors.surface, padding: 8, marginTop: 8}, specCard: {width: '25%', minHeight: 82, borderWidth: 0.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', padding: 5}, specValue: {fontSize: 11, fontWeight: '700', color: colors.text, textAlign: 'center', marginTop: 5}, specLabel: {fontSize: 8, color: colors.textMuted, textAlign: 'center', marginTop: 3},
  keyGrid: {flexDirection: 'row', flexWrap: 'wrap'}, keySpec: {width: '50%', flexDirection: 'row', alignItems: 'center', paddingVertical: 8}, keyCopy: {marginLeft: 8}, keyLabel: {fontSize: 10, color: colors.textMuted}, keyValue: {fontSize: 11, fontWeight: '700', color: colors.text, marginTop: 2}, viewSpecs: {marginTop: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}, viewSpecsText: {fontSize: 11, fontWeight: '700', color: '#2563eb'}, features: {flexDirection: 'row', justifyContent: 'space-between'}, feature: {width: '19%', alignItems: 'center'}, featureIcon: {width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center'}, featureText: {fontSize: 8, color: colors.text, textAlign: 'center', marginTop: 6},
  statusRow: {flexDirection: 'row', gap: 7}, statusCard: {flex: 1, minHeight: 70, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 8, flexDirection: 'row', alignItems: 'center'}, statusIcon: {width: 31, height: 31, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 6}, statusTitle: {fontSize: 9, fontWeight: '700', color: colors.text}, statusValue: {fontSize: 8, color: colors.textMuted, marginTop: 3}, sellerRow: {flexDirection: 'row', alignItems: 'center'}, avatar: {width: 48, height: 48, borderRadius: 24, backgroundColor: colors.text, alignItems: 'center', justifyContent: 'center'}, avatarText: {fontSize: 15, fontWeight: '800', color: '#ef4444'}, sellerCopy: {flex: 1, marginLeft: 11}, sellerName: {fontSize: 14, fontWeight: '800', color: colors.text}, rating: {fontSize: 11, color: '#f59e0b', marginVertical: 4}, muted: {fontSize: 10, color: colors.textMuted}, mapWrap: {height: 130, borderRadius: 10, overflow: 'hidden'}, map: {width: '100%', height: '100%', resizeMode: 'cover'}, pin: {position: 'absolute', top: 45, left: '46%'}, mapFooter: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}, mapLocation: {fontSize: 12, fontWeight: '700', color: colors.text}, mapLink: {fontSize: 11, fontWeight: '700', color: '#2563eb'}, enquireCard: {margin: 8, padding: 14, borderRadius: 12, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, enquireTitle: {fontSize: 13, fontWeight: '800', color: colors.text, marginBottom: 4}, enquireButton: {backgroundColor: '#ef4444', borderRadius: 8, paddingHorizontal: 17, paddingVertical: 12}, enquireButtonText: {fontSize: 12, fontWeight: '700', color: '#fff'}, recommendHeader: {flexDirection: 'row', justifyContent: 'space-between'}, recommendCard: {width: 150, marginRight: 10, padding: 8, borderWidth: 1, borderColor: colors.border, borderRadius: 10}, recommendImage: {width: '100%', height: 90, resizeMode: 'cover', borderRadius: 8}, recommendTitle: {fontSize: 11, fontWeight: '700', color: colors.text, marginTop: 7}, recommendPrice: {fontSize: 12, fontWeight: '800', color: '#ef4444', marginTop: 5},
  bottomBar: {position: 'absolute', left: 0, right: 0, bottom: 0, height: 72, paddingHorizontal: 8, paddingVertical: 10, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, flexDirection: 'row', gap: 7}, callButton: {flex: 1, borderWidth: 1, borderColor: '#ef4444', borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, callText: {fontSize: 11, fontWeight: '700', color: '#ef4444', marginLeft: 5}, whatsappButton: {flex: 1, borderWidth: 1, borderColor: '#16a34a', borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, whatsappText: {fontSize: 11, fontWeight: '700', color: '#16a34a', marginLeft: 5}, primaryButton: {flex: 1.25, backgroundColor: '#ef4444', borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, primaryText: {fontSize: 11, fontWeight: '700', color: '#fff', marginLeft: 5},
});
