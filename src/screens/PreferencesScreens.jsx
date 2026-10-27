import {useThemeStyles} from '../theme/colors';
import React, {useEffect, useState} from 'react';
import {Alert, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const SAVED_SEARCHES_KEY = 'vehicle-saved-searches';

const PageHeader = ({title, navigation}) => {
  const {colors, styles} = useThemeStyles(createStyles);
  return (<View style={styles.header}><TouchableOpacity style={styles.back} onPress={() => navigation.goBack()} accessibilityLabel="Go back"><Icon name="chevron-back" size={24} color={colors.text} /></TouchableOpacity><Text style={styles.heading}>{title}</Text><View style={styles.spacer} /></View>);
};

export const SavedSearchesScreen = ({navigation}) => {
  const {colors, styles} = useThemeStyles(createStyles);

  const [searches, setSearches] = useState([]);
  const load = async () => {
    try {setSearches(JSON.parse(await AsyncStorage.getItem(SAVED_SEARCHES_KEY) || '[]'));} catch {setSearches([]);}
  };
  useEffect(() => {load();}, []);
  const remove = async query => {
    const next = searches.filter(item => item !== query);
    setSearches(next);
    await AsyncStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(next));
  };
  return <SafeAreaView style={styles.container}><PageHeader title="Saved Searches" navigation={navigation} /><FlatList data={searches} keyExtractor={item => item} contentContainerStyle={searches.length ? styles.list : styles.empty} renderItem={({item}) => <View style={styles.searchCard}><View style={styles.searchIcon}><Icon name="search-outline" size={20} color="#ef4444" /></View><Text style={styles.searchText}>{item}</Text><TouchableOpacity onPress={() => remove(item)} accessibilityLabel={`Remove ${item}`}><Icon name="close-circle" size={22} color={colors.textMuted} /></TouchableOpacity></View>} ListEmptyComponent={<><Icon name="search-outline" size={62} color={colors.textMuted} /><Text style={styles.emptyTitle}>No saved searches</Text><Text style={styles.emptyBody}>Search from Home, then tap the filter icon to save it here.</Text></>} /></SafeAreaView>;
};

export const HelpSupportScreen = ({navigation}) => {
  const {colors, styles} = useThemeStyles(createStyles);

  const [open, setOpen] = useState(null);
  const faqs = [['How do I contact a seller?', 'Open a vehicle listing and use the contact option to connect with the seller.'], ['How do I save a vehicle?', 'Tap the heart icon on any vehicle card to add it to your Wishlist.'], ['How do I post a sale?', 'Open the My Sales tab and follow the options to create your listing.']];
  return <SafeAreaView style={styles.container}><PageHeader title="Help & Support" navigation={navigation} /><View style={styles.content}><View style={styles.helpHero}><Icon name="chatbubble-ellipses-outline" size={34} color="#ef4444" /><Text style={styles.helpTitle}>How can we help?</Text><Text style={styles.rowBody}>Browse quick answers below.</Text></View><Text style={styles.section}>FREQUENTLY ASKED QUESTIONS</Text>{faqs.map(([question, answer], index) => <TouchableOpacity key={question} style={styles.faq} onPress={() => setOpen(open === index ? null : index)}><View style={styles.faqTitleRow}><Text style={styles.rowTitle}>{question}</Text><Icon name={open === index ? 'chevron-up' : 'chevron-down'} size={19} color={colors.textMuted} /></View>{open === index ? <Text style={styles.faqAnswer}>{answer}</Text> : null}</TouchableOpacity>)}<TouchableOpacity style={styles.contactButton} onPress={() => Alert.alert('Support request', 'Our support team will be available soon.')}><Icon name="mail-outline" size={19} color="#fff" /><Text style={styles.contactText}>Contact Support</Text></TouchableOpacity></View></SafeAreaView>;
};

const createStyles = colors => StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background}, header: {height: 68, paddingHorizontal: 15, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, back: {width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center'}, heading: {fontSize: 20, fontWeight: '800', color: colors.text}, spacer: {width: 42}, content: {padding: 16}, section: {fontSize: 12, fontWeight: '800', color: colors.textMuted, marginBottom: 9}, panel: {borderRadius: 16, backgroundColor: colors.surface}, settingRow: {minHeight: 80, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border}, settingIcon: {width: 38, height: 38, borderRadius: 11, backgroundColor: colors.accentSurface, alignItems: 'center', justifyContent: 'center'}, settingText: {flex: 1, marginLeft: 11, marginRight: 8}, rowTitle: {fontSize: 14, fontWeight: '700', color: colors.text}, rowBody: {fontSize: 12, lineHeight: 18, color: colors.textMuted, marginTop: 3}, note: {fontSize: 12, color: colors.textMuted, marginTop: 12}, list: {padding: 14, gap: 10}, searchCard: {minHeight: 62, paddingHorizontal: 13, borderRadius: 14, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center'}, searchIcon: {width: 36, height: 36, borderRadius: 18, backgroundColor: colors.accentSurface, alignItems: 'center', justifyContent: 'center'}, searchText: {flex: 1, marginLeft: 11, fontSize: 15, fontWeight: '600', color: colors.text}, empty: {flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40}, emptyTitle: {fontSize: 19, fontWeight: '800', color: colors.text, marginTop: 14}, emptyBody: {fontSize: 13, color: colors.textMuted, lineHeight: 20, textAlign: 'center', marginTop: 7}, helpHero: {padding: 20, marginBottom: 24, borderRadius: 18, alignItems: 'center', backgroundColor: colors.accentSurface}, helpTitle: {fontSize: 19, fontWeight: '800', color: colors.text, marginTop: 8}, faq: {padding: 15, marginBottom: 9, borderRadius: 14, backgroundColor: colors.surface}, faqTitleRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, faqAnswer: {fontSize: 13, lineHeight: 20, color: colors.textMuted, marginTop: 10}, contactButton: {height: 50, marginTop: 14, borderRadius: 12, backgroundColor: '#ef4444', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8}, contactText: {fontSize: 15, fontWeight: '800', color: '#fff'},
});
