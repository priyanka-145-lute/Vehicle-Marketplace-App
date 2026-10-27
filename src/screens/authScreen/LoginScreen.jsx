import {useThemeStyles} from '../../theme/colors';
import React, {useRef, useState} from 'react';
import {ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useRegisterUserMutation, useSendOtpMutation} from '../../redux/api';

const LoginScreen = ({navigation}) => {
  const {colors, styles} = useThemeStyles(createStyles);
  const [form, setForm] = useState({FirstName: '', LastName: '', mobileNo: '', Email: ''});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const busy = useRef(false);
  const [registerUser, {reset}] = useRegisterUserMutation();
  const [sendOtp, {reset: resetOtp}] = useSendOtpMutation();
  const change = (key, value) => {
    setForm(current => ({...current, [key]: key === 'mobileNo' ? value.replace(/[^0-9]/g, '').slice(0, 10) : value}));
    setError('');
  };

  const handleContinue = async () => {
    if (busy.current) {return;}
    const body = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()]));
    if (!isLogin && (!body.FirstName || !body.LastName)) {setError('Please enter your first and last name.'); return;}
    if (!/^[0-9]{10}$/.test(body.mobileNo)) {setError('Please enter a valid 10-digit mobile number.'); return;}
    if (!isLogin && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.Email)) {setError('Please enter a valid email address.'); return;}
    busy.current = true;
    setSubmitting(true);
    setError('');
    try {
      if (!isLogin) {
        const response = await registerUser(body).unwrap();
        if (response?.success !== true) {
          setError(typeof response?.message === 'string' ? response.message : 'Could not register. Please try again.');
          return;
        }
        setIsLogin(true);
      }
      const response = await sendOtp({mobileNo: body.mobileNo}).unwrap();
      if (response?.success !== true) {
        setError(typeof response?.message === 'string' ? response.message : 'Could not send OTP. Please try again.');
        return;
      }
      navigation.navigate('Otp', {mobileNumber: body.mobileNo, otp: response.otp});
    } catch (failure) {
      setError(typeof failure?.data?.message === 'string' ? failure.data.message : 'Could not continue. Please try again.');
    } finally {
      reset();
      resetOtp();
      busy.current = false;
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.iconWrap}><Icon name="person-add-outline" size={42} color="#ef4444" /></View>
          <Text style={styles.title}>Welcome to Gadi Dekho</Text>
          <Text style={styles.subtitle}>{isLogin ? 'Enter your mobile number to sign in with OTP.' : 'Enter your details to register and continue.'}</Text>
          {[
            ['FirstName', 'First Name', 'Enter first name', {autoCapitalize: 'words', maxLength: 80}],
            ['LastName', 'Last Name', 'Enter last name', {autoCapitalize: 'words', maxLength: 80}],
            ['mobileNo', 'Mobile Number', 'Enter 10-digit number', {keyboardType: 'phone-pad', maxLength: 10}],
            ['Email', 'Email Address', 'Enter email address', {keyboardType: 'email-address', autoCapitalize: 'none', autoCorrect: false, maxLength: 254}],
          ].filter(([key]) => !isLogin || key === 'mobileNo').map(([key, label, placeholder, options]) => <View key={key} style={styles.field}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputWrap}>
              {key === 'mobileNo' && <><Text style={styles.countryCode}>+91</Text><View style={styles.divider} /></>}
              <TextInput accessibilityLabel={label} value={form[key]} onChangeText={value => change(key, value)} editable={!submitting} placeholder={placeholder} placeholderTextColor={colors.textMuted} style={styles.input} {...options} />
            </View>
          </View>)}
          {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Switch sign-in mode" disabled={submitting} style={styles.modeButton} onPress={() => {setIsLogin(value => !value); setError('');}}><Text style={styles.modeText}>{isLogin ? 'New here? Register' : 'Already registered? Sign in'}</Text></TouchableOpacity>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Continue with OTP" disabled={submitting} activeOpacity={0.85} style={[styles.button, submitting && styles.buttonDisabled]} onPress={handleContinue}>
            {submitting ? <ActivityIndicator color="#fff" accessibilityLabel="Please wait" /> : <Text style={styles.buttonText}>{isLogin ? 'Send OTP' : 'Register & Continue'}</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const createStyles = colors => StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.surface}, keyboardView: {flex: 1},
  backButton: {width: 44, height: 44, marginTop: 12, marginLeft: 16, alignItems: 'center', justifyContent: 'center'},
  field: {marginBottom: 18},
  modeButton: {paddingVertical: 16, alignItems: 'center'}, modeText: {color: '#ef4444', fontSize: 14, fontWeight: '700'},
  content: {flexGrow: 1, paddingBottom: 24, paddingHorizontal: 24, paddingTop: 34},
  iconWrap: {width: 76, height: 76, borderRadius: 38, backgroundColor: colors.accentSurface, alignItems: 'center', justifyContent: 'center', marginBottom: 28},
  title: {fontSize: 28, lineHeight: 35, fontWeight: '800', color: colors.text},
  subtitle: {fontSize: 15, lineHeight: 23, color: colors.textMuted, marginTop: 10, marginBottom: 34},
  label: {fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 9},
  inputWrap: {height: 58, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, backgroundColor: colors.surfaceMuted},
  inputError: {borderColor: '#ef4444'}, countryCode: {fontSize: 16, fontWeight: '700', color: colors.text},
  divider: {height: 26, width: 1, backgroundColor: colors.textMuted, marginHorizontal: 14}, input: {flex: 1, fontSize: 16, color: colors.text, paddingVertical: 0},
  error: {fontSize: 13, color: '#ef4444', marginTop: 8}, footer: {paddingHorizontal: 24, paddingBottom: 24},
  button: {height: 56, borderRadius: 14, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center', elevation: 3},
  buttonDisabled: {backgroundColor: '#fca5a5', elevation: 0}, buttonText: {fontSize: 17, fontWeight: '700', color: '#fff'},
});
