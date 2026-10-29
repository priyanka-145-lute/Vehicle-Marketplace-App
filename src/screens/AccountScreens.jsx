import {useThemeStyles} from '../theme/colors';
import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Alert, KeyboardAvoidingView, Linking, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../context/ThemeContext';
import LocationFields from '../components/LocationFields';
import {useDeleteAddressMutation, useGetProfileQuery, useGetUserAddressByIdMutation, useGetUserAddressesQuery, useUpdateAddressMutation} from '../redux/api';

export const AccountLogoutContext = createContext(null);
const ProfileContext = createContext(null);
const Stack = createNativeStackNavigator();
const STORAGE_KEY = 'vehicle-account-profile';
const EMPTY_PROFILE = {name: '', mobile: '', email: '', city: ''};

const Button = ({title, onPress, disabled}) => {
  const {styles} = useThemeStyles(createStyles);
  return (<TouchableOpacity accessibilityRole="button" disabled={disabled} onPress={onPress} style={[styles.button, disabled && styles.disabled]}><Text style={styles.buttonText}>{title}</Text></TouchableOpacity>);
};
const Avatar = ({name}) => {
  const {styles} = useThemeStyles(createStyles);
  return (<View style={styles.avatar}>{name ? <Text style={styles.initial}>{name.trim().charAt(0).toUpperCase()}</Text> : <Icon name="person-outline" size={32} color="#ef4444" />}</View>);
};
const Page = ({title, navigation, children}) => {
  const {colors, styles} = useThemeStyles(createStyles);
  return (<SafeAreaView edges={['top', 'left', 'right']} style={styles.container}><View style={styles.header}>{navigation.canGoBack() && <TouchableOpacity accessibilityRole="button" accessibilityLabel="Go back" style={styles.back} onPress={() => navigation.goBack()}><Icon name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>}<Text style={styles.heading}>{title}</Text></View>{children}</SafeAreaView>);
};

const AccountScreen = ({navigation}) => {
  const {colors, styles} = useThemeStyles(createStyles);

  const {profile, loading, loadError} = useContext(ProfileContext);
  const logout = useContext(AccountLogoutContext);
  const options = [
    ['My Profile', 'View and edit your details', 'person-outline', 'Profile'],
    ['Contact Us', 'Help and support', 'chatbubble-ellipses-outline', 'ContactUs'],
    ['Privacy Policy', 'Information about your data', 'shield-checkmark-outline', 'PrivacyPolicy'],
    ['Terms & Conditions', 'Terms for using the marketplace', 'document-text-outline', 'TermsConditions'],
  ];
  return <Page title="Account" navigation={navigation}><ScrollView contentContainerStyle={styles.content}>
    <TouchableOpacity accessibilityRole="button" style={styles.profileCard} onPress={() => navigation.navigate('Profile')}><Avatar name={profile.name} /><View style={styles.flex}><Text style={styles.name}>{loading ? 'Loading profile…' : profile.name || 'Your Profile'}</Text><Text style={styles.muted}>{loadError ? 'Tap to retry loading your profile' : profile.city || 'Manage your personal information'}</Text></View><Icon name="chevron-forward" size={21} color={colors.textMuted} /></TouchableOpacity>
    <Text style={styles.sectionLabel}>ACCOUNT & SUPPORT</Text>
    <View style={styles.card}>{options.map(([title, subtitle, icon, route], index) => <TouchableOpacity key={route} accessibilityRole="button" onPress={() => navigation.navigate(route)} style={[styles.menuRow, index !== options.length - 1 && styles.divider]}><View style={styles.menuIcon}><Icon name={icon} size={22} color="#ef4444" /></View><View style={styles.flex}><Text style={styles.menuTitle}>{title}</Text><Text style={styles.muted}>{subtitle}</Text></View><Icon name="chevron-forward" size={18} color={colors.textMuted} /></TouchableOpacity>)}</View>
    <TouchableOpacity accessibilityRole="button" style={styles.logout} onPress={() => Alert.alert('Log out?', 'You will return to the sign-in flow. Your saved data will remain on this device.', [{text: 'Cancel', style: 'cancel'}, {text: 'Log Out', style: 'destructive', onPress: logout}])}><Icon name="log-out-outline" size={22} color="#ef4444" /><Text style={styles.logoutText}>Log Out</Text></TouchableOpacity>
  </ScrollView></Page>;
};

export const ProfileScreen = ({navigation}) => {
  const {colors, styles} = useThemeStyles(createStyles);

  const {profile, loading, loadError, load} = useContext(ProfileContext);
  const {isDark, toggleTheme} = useTheme();
  return <Page title="My Profile" navigation={navigation}>{loading ? <ActivityIndicator style={styles.flex} color="#ef4444" /> : loadError ? <View style={styles.content}><Text style={styles.body}>Could not load your profile. Please try again.</Text><Button title="Try Again" onPress={load} /></View> : <ScrollView contentContainerStyle={styles.content}>
    <View style={styles.profileSummary}><Avatar name={profile.name} /><Text style={styles.name}>{profile.name || 'Complete your profile'}</Text><Text style={styles.muted}>Your personal information</Text></View>
    <View style={styles.card}>{[['Full name', 'name'], ['Mobile number', 'mobile'], ['Email address', 'email'], ['City', 'city']].map(([label, key]) => <View key={key} style={styles.detail}><Text style={styles.muted}>{label}</Text><Text style={styles.value}>{profile[key] || 'Not added'}</Text></View>)}</View>
    <View style={styles.card}><View style={styles.themeRow}><View style={styles.menuIcon}><Icon name="moon-outline" size={22} color="#ef4444" /></View><View style={styles.flex}><Text style={styles.menuTitle}>Dark Theme</Text><Text style={styles.muted}>Use dark colours across the app</Text></View><Switch accessibilityLabel="Dark theme" value={isDark} onValueChange={toggleTheme} trackColor={{false: colors.border, true: '#fca5a5'}} thumbColor={isDark ? '#ef4444' : '#f8fafc'} /></View></View>
    <Button title="Edit Profile" onPress={() => navigation.navigate('EditProfile')} />
    <Button title="My Addresses" onPress={() => navigation.navigate('MyAddresses')} />
    <Text style={styles.note}>Profile details are saved on this device. Editing your mobile number here does not change your sign-in number.</Text>
  </ScrollView>}</Page>;
};

export const UserAddressesScreen = ({navigation}) => {
  const {colors, styles} = useThemeStyles(createStyles);
  const {currentData, isFetching, isError, refetch} = useGetUserAddressesQuery(undefined, {refetchOnMountOrArgChange: true});
  const [getAddress] = useGetUserAddressByIdMutation();
  const [updateAddress] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const pending = useRef(false);
  const fields = ['AddressType', 'AddressLine1', 'AddressLine2', 'Landmark', 'Pincode', 'Latitude', 'Longitude'];
  const run = async action => {
    if (pending.current) {return;}
    pending.current = true; setBusy(true); setError('');
    try {await action();} catch (failure) {setError(failure.data?.message || failure.message || 'Could not complete the request. Please try again.');}
    finally {pending.current = false; setBusy(false);}
  };
  const edit = address => run(async () => {
    const response = await getAddress({AddressID: String(address.AddressID)}).unwrap();
    const detail = Array.isArray(response.data) ? response.data[0] : response.data;
    if (response.success !== true || !detail || String(detail.AddressID) !== String(address.AddressID)) {throw new Error('Could not load this address. Please try again.');}
    setForm({AddressID: String(detail.AddressID), ...Object.fromEntries(fields.map(key => [key, String(detail[key] ?? '')]))});
  });
  const save = () => {
    const body = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()]));
    if (!body.AddressType || !body.AddressLine1 || !/^[0-9]{6}$/.test(body.Pincode)) {setError('Enter address type, address line 1 and a valid 6-digit pincode.'); return;}
    if (body.Latitude === '' || body.Longitude === '' || !Number.isFinite(Number(body.Latitude)) || Math.abs(Number(body.Latitude)) > 90 || !Number.isFinite(Number(body.Longitude)) || Math.abs(Number(body.Longitude)) > 180) {setError('Enter valid latitude and longitude.'); return;}
    run(async () => {
      const response = await updateAddress(body).unwrap();
      if (response.success !== true) {throw new Error(response.message || 'Could not update address.');}
      setForm(null); refetch();
    });
  };
  const remove = address => Alert.alert('Delete address?', 'This saved address will be removed.', [{text: 'Cancel', style: 'cancel'}, {text: 'Delete', style: 'destructive', onPress: () => run(async () => {
    const response = await deleteAddress({AddressID: String(address.AddressID)}).unwrap();
    if (response.success !== true) {throw new Error(response.message || 'Could not delete address.');}
    refetch();
  })}]);
  const invalid = currentData && (currentData.success !== true || !Array.isArray(currentData.data));
  const addresses = Array.isArray(currentData?.data) ? currentData.data : [];
  if (form) {return <Page title="Edit Address" navigation={navigation}><KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    {fields.map(key => <View key={key} style={styles.field}><Text style={styles.label}>{key}</Text><TextInput accessibilityLabel={key} style={styles.input} placeholderTextColor={colors.textMuted} value={form[key]} editable={!busy} onChangeText={value => setForm(current => ({...current, [key]: value}))} keyboardType={key === 'Pincode' ? 'number-pad' : 'default'} /></View>)}
    {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
    <Button title={busy ? 'Saving…' : 'Save Address'} disabled={busy} onPress={save} />
    <Button title="Cancel" disabled={busy} onPress={() => {setForm(null); setError('');}} />
  </ScrollView></KeyboardAvoidingView></Page>;}
  return <Page title="My Addresses" navigation={navigation}><ScrollView contentContainerStyle={styles.content}>
    {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
    {busy ? <ActivityIndicator accessibilityLabel="Updating address" color="#ef4444" /> : null}
    {isFetching ? <ActivityIndicator accessibilityLabel="Loading addresses" color="#ef4444" /> : isError || invalid ? <View><Text accessibilityRole="alert" style={styles.error}>Could not load your addresses. Please try again.</Text><Button title="Try Again" onPress={refetch} /></View> : addresses.length ? addresses.map(address => <View key={address.AddressID} style={[styles.card, styles.detail]}>
      <Text style={styles.menuTitle}>{address.AddressType || 'Address'}</Text>
      {address.IsDefault === true && <Text style={styles.muted}>Default address</Text>}
      {[address.AddressLine1, address.AddressLine2, address.Landmark, address.AreaName, address.CityName, address.Pincode].filter(value => value != null && value !== '').map((value, index) => <Text key={index} style={styles.value}>{value}</Text>)}
      <Button title="Edit" disabled={busy || address.AddressID == null} onPress={() => edit(address)} />
      <Button title="Delete" disabled={busy || address.AddressID == null} onPress={() => remove(address)} />
    </View>) : <Text style={styles.body}>No saved addresses found.</Text>}
  </ScrollView></Page>;
};

export const EditProfileScreen = ({navigation}) => {
  const {colors, styles} = useThemeStyles(createStyles);

  const {profile, saveProfile} = useContext(ProfileContext);
  const [form, setForm] = useState({...profile});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const busy = useRef(false);
  const save = async () => {
    if (busy.current) {return;}
    const next = {...form, ...Object.fromEntries(Object.keys(EMPTY_PROFILE).map(key => [key, form[key].trim()]))};
    if (!next.name) {setError('Please enter your full name.'); return;}
    if (next.mobile && !/^[0-9]{10}$/.test(next.mobile)) {setError('Enter a valid 10-digit mobile number.'); return;}
    if (next.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.email)) {setError('Enter a valid email address.'); return;}
    if (next.locationDetails?.countryId && !next.locationDetails.cityId) {setError('Please select a state and city.'); return;}
    busy.current = true;
    setSaving(true);
    setError('');
    try {await saveProfile(next); navigation.goBack();} catch {setError('Could not save your profile. Please try again.');} finally {busy.current = false; setSaving(false);}
  };
  return <Page title="Edit Profile" navigation={navigation}><KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <View style={styles.profileSummary}><Avatar name={form.name} /><Text style={styles.muted}>Keep your contact details up to date</Text></View>
    {[
      ['name', 'Full name *', 'Your full name', {maxLength: 80, autoCapitalize: 'words'}],
      ['mobile', 'Mobile number', '10-digit mobile number', {keyboardType: 'phone-pad', maxLength: 10}],
      ['email', 'Email address', 'you@example.com', {keyboardType: 'email-address', autoCapitalize: 'none', autoCorrect: false, maxLength: 254}],
    ].map(([key, label, placeholder, options]) => <View key={key} style={styles.field}><Text style={styles.label}>{label}</Text><TextInput accessibilityLabel={label} editable={!saving} style={styles.input} value={form[key]} placeholder={placeholder} placeholderTextColor={colors.textMuted} onChangeText={value => setForm(current => ({...current, [key]: key === 'mobile' ? value.replace(/[^0-9]/g, '') : value}))} {...options} /></View>)}
    {!form.locationDetails?.countryId && form.city ? <Text style={styles.muted}>Saved city: {form.city}</Text> : null}
    <LocationFields value={form.locationDetails} disabled={saving} onChange={locationDetails => {setForm(current => ({...current, locationDetails, city: locationDetails.cityName || ''})); setError('');}} />
    {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
    <Button title={saving ? 'Saving…' : 'Save Changes'} disabled={saving} onPress={save} />
  </ScrollView></KeyboardAvoidingView></Page>;
};

const info = {
  ContactUs: {title: 'Contact Us', icon: 'chatbubble-ellipses-outline', heading: 'How can we help?', text: 'Call us or connect with us on WhatsApp for help with your vehicle enquiries.'},
  PrivacyPolicy: {title: 'Privacy Policy', icon: 'shield-checkmark-outline', heading: 'Privacy information', text: 'The official privacy policy has not been published yet. Please check back for information about how the service handles your data.'},
  TermsConditions: {title: 'Terms & Conditions', icon: 'document-text-outline', heading: 'Terms of use', text: 'The official terms and conditions have not been published yet. Please check back for the terms that apply to using this marketplace.'},
};
const InformationScreen = ({navigation, route}) => {
  const {styles} = useThemeStyles(createStyles);

  const content = info[route.name];
  const openContact = async whatsapp => {
    try {
      await Linking.openURL(whatsapp ? 'https://wa.me/918149709394' : 'tel:+918149709394');
    } catch {
      Alert.alert(whatsapp ? 'Could not open WhatsApp' : 'Could not open the dialer', 'Please contact us on +91 8149709394.');
    }
  };
  return <Page title={content.title} navigation={navigation}><ScrollView contentContainerStyle={styles.content}><View style={styles.infoCard}><View style={styles.avatar}><Icon name={content.icon} size={32} color="#ef4444" /></View><Text style={styles.name}>{content.heading}</Text><Text style={styles.body}>{content.text}</Text>
    {route.name === 'ContactUs' && <View style={styles.contactActions}>
      <Text selectable style={styles.name}>+91 8149709394</Text>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Call 8149709394" style={[styles.button, styles.contactButton]} onPress={() => openContact(false)}><Icon name="call-outline" size={22} color="#fff" /><Text style={styles.buttonText}>Call Us</Text></TouchableOpacity>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="WhatsApp 8149709394" style={[styles.button, styles.contactButton, styles.whatsappButton]} onPress={() => openContact(true)}><Icon name="logo-whatsapp" size={23} color="#fff" /><Text style={styles.buttonText}>WhatsApp</Text></TouchableOpacity>
    </View>}
  </View></ScrollView></Page>;
};

const AccountNavigator = () => {
  const {currentData, isLoading, isError, refetch} = useGetProfileQuery(undefined, {refetchOnMountOrArgChange: true});
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const load = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : EMPTY_PROFILE;
      if (!data || Object.keys(EMPTY_PROFILE).some(key => typeof data[key] !== 'string')) {throw new Error('Invalid profile');}
      setProfile({...Object.fromEntries(Object.keys(EMPTY_PROFILE).map(key => [key, data[key]])), ...(data.locationDetails && typeof data.locationDetails === 'object' && !Array.isArray(data.locationDetails) ? {locationDetails: data.locationDetails} : {})});
    } catch {setLoadError(true);} finally {setLoading(false);}
  };
  useEffect(() => {load();}, []);
  const customer = currentData?.data?.[0];
  const invalidProfile = currentData && (currentData.success !== true || !Array.isArray(currentData.data) || !customer || ['FirstName', 'LastName', 'MobileNo', 'Email'].some(key => customer[key] != null && typeof customer[key] !== 'string'));
  useEffect(() => {
    if (!loading && customer && !invalidProfile) {
      setProfile(current => ({...current, name: [customer.FirstName, customer.LastName].filter(Boolean).join(' ').trim(), mobile: customer.MobileNo || '', email: customer.Email || ''}));
    }
  }, [customer, invalidProfile, loading]);
  const saveProfile = async next => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setProfile(next);
  };
  return <ProfileContext.Provider value={{profile, loading: loading || isLoading, loadError: loadError || isError || invalidProfile, load: () => {load(); refetch();}, saveProfile}}><Stack.Navigator screenOptions={{headerShown: false}}><Stack.Screen name="AccountHome" component={AccountScreen} /><Stack.Screen name="Profile" component={ProfileScreen} /><Stack.Screen name="EditProfile" component={EditProfileScreen} /><Stack.Screen name="MyAddresses" component={UserAddressesScreen} /><Stack.Screen name="ContactUs" component={InformationScreen} /><Stack.Screen name="PrivacyPolicy" component={InformationScreen} /><Stack.Screen name="TermsConditions" component={InformationScreen} /></Stack.Navigator></ProfileContext.Provider>;
};
export default AccountNavigator;

const createStyles = colors => StyleSheet.create({
  contactActions: {gap: 14}, contactButton: {flexDirection: 'row', gap: 10}, whatsappButton: {backgroundColor: '#15803d'},
  flex: {flex: 1}, container: {flex: 1, backgroundColor: colors.background}, header: {minHeight: 72, paddingHorizontal: 20, paddingVertical: 16, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', gap: 10}, back: {width: 44, height: 44, justifyContent: 'center', alignItems: 'center'}, heading: {fontSize: 23, fontWeight: '800', color: colors.text}, content: {padding: 18, paddingBottom: 30, gap: 18},
  profileCard: {flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, padding: 16, borderRadius: 16}, avatar: {width: 68, height: 68, borderRadius: 34, backgroundColor: colors.accentSurface, alignItems: 'center', justifyContent: 'center'}, initial: {fontSize: 28, fontWeight: '800', color: '#ef4444'}, name: {fontSize: 19, fontWeight: '700', color: colors.text}, muted: {fontSize: 12, color: colors.textMuted, marginTop: 5, lineHeight: 18}, sectionLabel: {fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 1, marginTop: 6}, card: {backgroundColor: colors.surface, borderRadius: 16, overflow: 'hidden'}, menuRow: {padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12}, divider: {borderBottomWidth: 1, borderBottomColor: colors.border}, menuIcon: {width: 40, height: 40, borderRadius: 12, backgroundColor: colors.accentSurface, alignItems: 'center', justifyContent: 'center'}, menuTitle: {fontSize: 15, fontWeight: '600', color: colors.text}, logout: {minHeight: 52, backgroundColor: colors.surface, borderRadius: 12, flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center'}, logoutText: {fontSize: 15, color: '#ef4444', fontWeight: '700'},
  themeRow: {minHeight: 76, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12},
  profileSummary: {alignItems: 'center', gap: 10, paddingVertical: 12}, detail: {paddingHorizontal: 18, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border}, value: {fontSize: 15, color: colors.text, marginTop: 6}, button: {minHeight: 50, backgroundColor: '#ef4444', borderRadius: 12, alignItems: 'center', justifyContent: 'center'}, buttonText: {fontSize: 15, color: '#fff', fontWeight: '700'}, disabled: {opacity: 0.5}, note: {fontSize: 12, lineHeight: 19, color: colors.textMuted}, field: {gap: 8}, label: {fontSize: 13, fontWeight: '600', color: colors.text}, input: {minHeight: 50, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: colors.surface, color: colors.text, fontSize: 15}, error: {color: '#dc2626', fontSize: 13}, infoCard: {padding: 24, borderRadius: 16, backgroundColor: colors.surface, gap: 18}, body: {fontSize: 15, lineHeight: 25, color: colors.textMuted},
});
