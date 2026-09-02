import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'Your One Stop',
    highlight: 'Auto Destination',
    subtitle: 'Cars, Bikes, Parts & Services\n— All in One Place',
    image:
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop',
    background: '#ffffff',
    dark: false,
  },
  {
    id: '2',
    title: 'Find the Perfect',
    highlight: 'Car or Bike',
    subtitle:
      'Explore wide range of cars and bikes from top brands.',
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
    background: '#0f172a',
    dark: true,
  },
  {
    id: '3',
    title: 'Genuine Parts',
    highlight: 'You Can Trust',
    subtitle:
      'Quality auto parts for best performance and safety.',
    image:
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1200&auto=format&fit=crop',
    background: '#ffffff',
    dark: false,
  },
  {
    id: '4',
    title: 'Expert Services',
    highlight: 'For Your Vehicle',
    subtitle:
      "From maintenance to repairs, we've got you covered.",
    image:
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1200&auto=format&fit=crop',
    background: '#0f172a',
    dark: true,
  },
  {
    id: '5',
    title: 'Best Deals',
    highlight: 'Every Day!',
    subtitle:
      'Great prices, exciting offers and trusted service — every day.',
    image:
      'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=1200&auto=format&fit=crop',
    background: '#ffffff',
    dark: false,
  },
];

const OnboardingScreen = ({navigation}) => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const nextIndex =
        currentIndex === onboardingData.length - 1 ? 0 : currentIndex + 1;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current.scrollToIndex({
        index: currentIndex + 1,
      });
    } else {
      navigation.replace('Login');
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const renderItem = ({ item }) => {
    return (
      <View
        style={[
          styles.slide,
          { backgroundColor: item.background },
        ]}>
        <StatusBar
          barStyle={item.dark ? 'light-content' : 'dark-content'}
        />

        <View style={styles.topContainer}>
          <Text
            style={[
              styles.title,
              item.dark ? styles.darkTitle : styles.lightTitle,
            ]}>
            {item.title}
          </Text>

          <Text style={styles.highlight}>{item.highlight}</Text>

          <Text
            style={[
              styles.subtitle,
              item.dark ? styles.darkSubtitle : styles.lightSubtitle,
            ]}>
            {item.subtitle}
          </Text>
        </View>

        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.bottomContainer}>
          <View style={styles.pagination}>
            {onboardingData.map((_, index) => {
              return (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    currentIndex === index && styles.activeDot,
                  ]}
                />
              );
            })}
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.button}
            onPress={handleNext}>
            <Text style={styles.buttonText}>
              {currentIndex === onboardingData.length - 1
                ? 'Get Started'
                : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={() => navigation.replace('Login')}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfig}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  skipButton: {
    position: 'absolute',
    top: 48,
    right: 22,
    zIndex: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  skipText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '700',
  },

  slide: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 70,
    paddingBottom: 40,
    paddingHorizontal: 25,
  },

  topContainer: {
    alignItems: 'center',
    marginTop: 10,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
  },

  darkTitle: {
    color: '#fff',
  },

  lightTitle: {
    color: '#111',
  },

  highlight: {
    fontSize: 34,
    fontWeight: '800',
    color: '#ef4444',
    marginTop: 5,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 20,
    paddingHorizontal: 10,
  },

  darkSubtitle: {
    color: '#cbd5e1',
  },

  lightSubtitle: {
    color: '#555',
  },

  image: {
    width: width * 0.9,
    height: height * 0.42,
    borderRadius: 25,
  },

  bottomContainer: {
    width: '100%',
    alignItems: 'center',
  },

  pagination: {
    flexDirection: 'row',
    marginBottom: 30,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#d1d5db',
    marginHorizontal: 5,
  },

  activeDot: {
    width: 24,
    backgroundColor: '#ef4444',
  },

  button: {
    backgroundColor: '#ef4444',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },

  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
