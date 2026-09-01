import React, {
  useRef,
  useState,
  useEffect,
} from 'react';

import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {bannerData} from '../data/dummyData';

const {width} = Dimensions.get('window');

const BannerSlider = () => {
  const flatListRef = useRef(null);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  // AUTO SLIDER

  useEffect(() => {
    const interval = setInterval(() => {

      if (currentIndex < bannerData.length - 1) {
        flatListRef.current?.scrollToIndex({
          index: currentIndex + 1,
          animated: true,
        });
      } else {
        flatListRef.current?.scrollToIndex({
          index: 0,
          animated: true,
        });
      }

    }, 3000);

    return () => clearInterval(interval);

  }, [currentIndex]);

  // NEXT BANNER

  const handleNext = () => {
    if (currentIndex < bannerData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      flatListRef.current?.scrollToIndex({
        index: 0,
        animated: true,
      });
    }
  };

  // PREVIOUS BANNER

  const handlePrev = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    } else {
      flatListRef.current?.scrollToIndex({
        index: bannerData.length - 1,
        animated: true,
      });
    }
  };

  // CURRENT INDEX

  const onViewableItemsChanged = useRef(
    ({viewableItems}) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
  ).current;

  const viewConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  // RENDER BANNER

  const renderBanner = ({item}) => {
    return (
      <View style={styles.bannerContainer}>

        {/* IMAGE */}

        <Image
          source={{uri: item.image}}
          style={styles.bannerImage}
        />

        {/* DARK OVERLAY */}

        <View style={styles.darkOverlay} />

        {/* CONTENT */}

        <View style={styles.overlayContent}>

          <Text style={styles.title}>
            FIND YOUR
          </Text>

          <Text style={styles.highlight}>
            DREAM CAR
          </Text>

          <Text style={styles.subtitle}>
            Great Deals on{'\n'}
            Top Brands
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.button}>

            <Text style={styles.buttonText}>
              EXPLORE NOW
            </Text>

          </TouchableOpacity>

        </View>

      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>

      {/* BANNER LIST */}

      <FlatList
        ref={flatListRef}
        data={bannerData}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={renderBanner}
        onViewableItemsChanged={
          onViewableItemsChanged
        }
        viewabilityConfig={viewConfigRef.current}
      />

      {/* LEFT BUTTON */}

      <TouchableOpacity
        style={styles.leftArrow}
        activeOpacity={0.8}
        onPress={handlePrev}>

        <Ionicons
          name="chevron-back"
          size={15}
          color="#FFFFFF"
        />

      </TouchableOpacity>

      {/* RIGHT BUTTON */}

      <TouchableOpacity
        style={styles.rightArrow}
        activeOpacity={0.8}
        onPress={handleNext}>

        <Ionicons
          name="chevron-forward"
          size={15}
          color="#FFFFFF"
        />

      </TouchableOpacity>

      {/* DOTS */}

      <View style={styles.dotsContainer}>
        {bannerData.map((_, index) => {
          return (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index &&
                  styles.activeDot,
              ]}
            />
          );
        })}
      </View>

    </View>
  );
};

export default BannerSlider;

const styles = StyleSheet.create({
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