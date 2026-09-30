import {colors} from '../theme/colors';
import React, {useContext, useMemo, useState} from 'react';
import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import BannerSlider from '../components/BannerSlider';
import CategoryCard from '../components/CategoryCard';

import {categoryData} from '../data/dummyData';
import {AccountLogoutContext} from './AccountScreens';
import {useTheme} from '../context/ThemeContext';

const SAVED_SEARCHES_KEY = 'vehicle-saved-searches';

const HomeScreen = ({navigation}) => {
  const logout = useContext(AccountLogoutContext);
  const {isDark} = useTheme();
  const [search, setSearch] = useState('');
  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {return categoryData;}
    return categoryData.filter(item => `${item.title} ${item.subtitle}`.toLowerCase().includes(query));
  }, [search]);
  const saveSearch = async () => {
    const query = search.trim();
    if (!query) {return;}
    try {
      const saved = JSON.parse(await AsyncStorage.getItem(SAVED_SEARCHES_KEY) || '[]');
      const next = [query, ...saved.filter(item => item.toLowerCase() !== query.toLowerCase())].slice(0, 8);
      await AsyncStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(next));
      Alert.alert('Search saved', `“${query}” was added to Saved Searches.`);
    } catch {
      Alert.alert('Could not save search', 'Please try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>

      <Header
        onHeartPress={() => navigation.navigate('Wishlist')}
        onNotificationPress={() => navigation.navigate('Notifications')}
        onSavedSearchesPress={() => navigation.navigate('SavedSearches')}
        onSettingsPress={() => Linking.openSettings()}
        onHelpPress={() => navigation.navigate('HelpSupport')}
        onLogoutPress={() => Alert.alert('Log out?', 'You will return to the sign-in flow.', [{text: 'Cancel', style: 'cancel'}, {text: 'Log Out', style: 'destructive', onPress: logout}])}
      />

      <SearchBar value={search} onChangeText={setSearch} onSaveSearch={saveSearch} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>

        {/* Main White Container */}
        <View style={[styles.mainContainer, isDark && styles.mainContainerDark]}>

          {/* Banner */}
          <View style={styles.bannerWrapper}>
            <BannerSlider />
          </View>

          {/* Title */}
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            Browse By Category
          </Text>

          {/* Cards */}
          <FlatList
            data={filteredCategories}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.listContainer}
            renderItem={({item}) => (
              <CategoryCard item={item} />
            )}
            ListEmptyComponent={<Text style={[styles.emptyText, isDark && styles.textDark]}>No categories found for “{search}”</Text>}
          />

        </View>

      </ScrollView>

    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  containerDark: {backgroundcolor: colors.text},

  scrollContainer: {
    paddingBottom: 120,
    paddingHorizontal: 10,
    paddingTop: 10,
  },

  /* MAIN WHITE BOX */
  mainContainer: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingTop: 12,
    paddingBottom: 15,

    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },

    // shadowOpacity: 0.08,
    // shadowRadius: 4,
    // elevation: 4,
  },

  /* BANNER PERFECTLY INSIDE */
  bannerWrapper: {
    marginHorizontal: 10,
    borderRadius: 18,
    overflow: 'hidden',
  },

  sectionTitle: {
    marginTop: 8,
    marginBottom: 14,
    marginHorizontal: 14,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },

  listContainer: {
    paddingHorizontal: 10,
  },
  mainContainerDark: {backgroundColor: '#1f2937'},
  textDark: {color: '#f8fafc'},
  emptyText: {paddingVertical: 28, textAlign: 'center', color: colors.textMuted, fontSize: 14},
});
