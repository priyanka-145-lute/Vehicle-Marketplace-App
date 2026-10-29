import React, {useEffect, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, Alert, Dimensions, FlatList, Image, Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useGetBannersQuery} from '../redux/api';

const {width} = Dimensions.get('window');
const isWebUrl = value => typeof value === 'string' && /^https?:\/\/[^\s]+$/i.test(value);

const BannerImage = ({IMG}) => {
  const [failed, setFailed] = useState(false);
  useEffect(() => {setFailed(false);}, [IMG]);
  if (!isWebUrl(IMG) || failed) {
    return <View accessibilityLabel="Banner image unavailable" style={[styles.bannerImage, styles.placeholder]}><Ionicons name="image-outline" size={42} color="#cbd5e1" /></View>;
  }
  return <Image source={{uri: IMG}} style={styles.bannerImage} onError={() => setFailed(true)} />;
};

const BannerSlider = () => {
  const {data, isLoading, isError, refetch} = useGetBannersQuery();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const failed = isError || (data && (data.success !== true || !Array.isArray(data.data)));
  const banners = useMemo(() => data?.success === true && Array.isArray(data.data)
    ? data.data.filter(item => item && ['number', 'string'].includes(typeof item.BANCODE) && typeof item.BNAME === 'string' && item.PLACEMENT === 'Top' && item.APAGE === 'Index' && item.APP === 'User')
    : [], [data]);

  useEffect(() => {
    setCurrentIndex(0);
    flatListRef.current?.scrollToOffset({offset: 0, animated: false});
  }, [banners]);

  useEffect(() => {
    if (banners.length < 2) {return undefined;}
    const interval = setInterval(() => {
      flatListRef.current?.scrollToIndex({index: (currentIndex + 1) % banners.length, animated: true});
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex, banners.length]);

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length && viewableItems[0].index != null) {setCurrentIndex(viewableItems[0].index);}
  }).current;
  const viewConfigRef = useRef({viewAreaCoveragePercentThreshold: 50});
  const openBanner = async BURL => {
    try {await Linking.openURL(BURL);} catch {Alert.alert('Could not open banner', 'Please try again.');}
  };
  const renderBanner = ({item}) => <TouchableOpacity
    activeOpacity={0.8}
    disabled={!isWebUrl(item.BURL)}
    accessibilityRole={isWebUrl(item.BURL) ? 'link' : 'image'}
    accessibilityLabel={item.BNAME}
    style={styles.bannerContainer}
    onPress={() => {if (isWebUrl(item.BURL)) {openBanner(item.BURL);}}}>
    <BannerImage IMG={item.IMG} />
    <View style={styles.darkOverlay} />
    <View style={styles.overlayContent}><Text style={styles.title}>{item.BNAME}</Text></View>
  </TouchableOpacity>;

  if (isLoading) {return <View style={styles.status}><ActivityIndicator accessibilityLabel="Loading banners" color="#ef4444" /></View>;}
  if (failed) {
    return <View style={styles.status}><Text accessibilityRole="alert" style={styles.statusText}>Could not load banners.</Text><TouchableOpacity accessibilityRole="button" accessibilityLabel="Retry banners" style={styles.retry} onPress={refetch}><Text style={styles.statusText}>Try Again</Text></TouchableOpacity></View>;
  }
  if (!banners.length) {return null;}

  return <View style={styles.mainContainer}>
    <FlatList
      ref={flatListRef}
      data={banners}
      horizontal
      pagingEnabled
      bounces={false}
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => String(item.BANCODE)}
      renderItem={renderBanner}
      getItemLayout={(_, index) => ({length: width - 20, offset: (width - 20) * index, index})}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewConfigRef.current}
    />
    {banners.length > 1 && <>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Previous banner" style={styles.leftArrow} activeOpacity={0.8} onPress={() => flatListRef.current?.scrollToIndex({index: (currentIndex - 1 + banners.length) % banners.length, animated: true})}><Ionicons name="chevron-back" size={15} color="#FFFFFF" /></TouchableOpacity>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Next banner" style={styles.rightArrow} activeOpacity={0.8} onPress={() => flatListRef.current?.scrollToIndex({index: (currentIndex + 1) % banners.length, animated: true})}><Ionicons name="chevron-forward" size={15} color="#FFFFFF" /></TouchableOpacity>
    </>}
    <View style={styles.dotsContainer}>{banners.map((item, index) => <View key={item.BANCODE} style={[styles.dot, currentIndex === index && styles.activeDot]} />)}</View>
  </View>;
};

export default BannerSlider;

const styles = StyleSheet.create({
  placeholder: {backgroundColor: '#334155', alignItems: 'center', justifyContent: 'center'},
  status: {height: 185, borderRadius: 18, backgroundColor: '#334155', alignItems: 'center', justifyContent: 'center', gap: 12},
  statusText: {fontSize: 14, color: '#fff'},
  retry: {minHeight: 44, paddingHorizontal: 20, justifyContent: 'center'},
  mainContainer: {
    marginTop: 0,
    borderRadius: 18,
    // overflow: 'hidden',
  },

 bannerContainer: {
  width: width - 20,
  alignItems: 'center',
  paddingHorizontal: 8,
},

  bannerImage: {
    width: width - 36,
    height: 185,
    borderRadius: 18,
    resizeMode: 'cover',
  },

  darkOverlay: {
    position: 'absolute',
    width: width - 36,
    height: 185,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.30)',
  },

  overlayContent: {
    position: 'absolute',
    left: 20,
    top: 22,
    width: '50%',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 28,
  },

  highlight: {
    color: '#FF1E1E',
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 28,
  },

  subtitle: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
    fontWeight: '500',
  },

  button: {
    marginTop: 14,
    backgroundColor: '#FF1E1E',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },

leftArrow: {
  position: 'absolute',
  left: 6,
  top: '43%',
  width: 26,
  height: 26,
  borderRadius: 13,
  backgroundColor: 'rgba(0,0,0,0.45)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999,
},

rightArrow: {
  position: 'absolute',
  right: 6,
  top: '43%',
  width: 26,
  height: 26,
  borderRadius: 13,
  backgroundColor: 'rgba(0,0,0,0.45)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999,
},

  dotsContainer: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 4,
  },

  activeDot: {
    width: 18,
    backgroundColor: '#FF1E1E',
  },
});