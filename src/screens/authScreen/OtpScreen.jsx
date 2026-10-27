import {useThemeStyles} from '../../theme/colors';
import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSendOtpMutation, useVerifyOtpMutation} from '../../redux/api';
import {isValidSession} from '../../redux/authSlice';

const OTP_LENGTH = 6;

const OtpScreen = ({navigation, route, setIsLoggedIn}) => {
  const {colors, styles} = useThemeStyles(createStyles);

  const receivedOtp = String(route.params?.otp ?? '');
  const [otp, setOtp] = useState(/^[0-9]{6}$/.test(receivedOtp) ? receivedOtp : '');
  const [seconds, setSeconds] = useState(30);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const busy = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const [verify, {reset: resetVerify}] = useVerifyOtpMutation();
  const [sendOtp, {reset: resetSend}] = useSendOtpMutation();
  const mobileNumber = route.params?.mobileNumber || '';

  useEffect(() => {
    if (seconds === 0) return undefined;
    const timer = setTimeout(() => setSeconds(value => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const verifyOtp = async () => {
    if (busy.current) {return;}
    if (!/^[0-9]{10}$/.test(mobileNumber)) {setError('Go back and enter a valid mobile number.'); return;}
    if (otp.length !== OTP_LENGTH) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }
    busy.current = true;
    setSubmitting(true);
    setError('');
    try {
      const response = await verify({mobileNo: mobileNumber, OTP: otp}).unwrap();
      if (response?.success !== true || !isValidSession(response.data)) {
        setError(response?.success === false && typeof response.message === 'string' ? response.message : 'Could not verify OTP. Please try again.');
        return;
      }
      await setIsLoggedIn(response.data);
    } catch (failure) {
      setError(typeof failure?.data?.message === 'string' ? failure.data.message : 'Could not complete sign-in. Please try again.');
    } finally {
      resetVerify();
      busy.current = false;
      setSubmitting(false);
    }
  };

  const resendOtp = async () => {
    if (seconds > 0 || busy.current) {return;}
    if (!/^[0-9]{10}$/.test(mobileNumber)) {setError('Go back and enter a valid mobile number.'); return;}
    busy.current = true;
    setSubmitting(true);
    setError('');
    try {
      const response = await sendOtp({mobileNo: mobileNumber}).unwrap();
      if (response?.success !== true) {
        setError(typeof response?.message === 'string' ? response.message : 'Could not resend OTP. Please try again.');
        return;
      }
      const nextOtp = String(response.otp ?? '');
      setOtp(/^[0-9]{6}$/.test(nextOtp) ? nextOtp : ''); setSeconds(30); inputRef.current?.focus();
    } catch (failure) {
      setError(typeof failure?.data?.message === 'string' ? failure.data.message : 'Could not resend OTP. Please try again.');
    } finally {
      resetSend();
      busy.current = false;
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableOpacity accessibilityLabel="Go back" disabled={submitting} style={styles.backButton} onPress={() => navigation.goBack()}><Icon name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
        <View style={styles.content}>
          <View style={styles.iconWrap}><Icon name="shield-checkmark-outline" size={42} color="#ef4444" /></View>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>Enter the 6-digit code sent to</Text>
          <View style={styles.numberRow}>
            <Text style={styles.number}>+91 {mobileNumber}</Text>
            <TouchableOpacity disabled={submitting} onPress={() => navigation.goBack()}><Text style={styles.change}>Change</Text></TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={1} style={styles.otpRow} onPress={() => inputRef.current?.focus()}>
            {Array.from({length: OTP_LENGTH}).map((_, index) => (
              <View key={index} style={[styles.otpBox, otp.length === index && styles.otpBoxActive, error ? styles.otpBoxError : null]}><Text style={styles.otpDigit}>{otp[index] || ''}</Text></View>
            ))}
            <TextInput accessibilityLabel="6-digit OTP" ref={inputRef} value={otp} editable={!submitting} onChangeText={value => {setOtp(value.replace(/[^0-9]/g, '').slice(0, OTP_LENGTH)); if (error) setError('');}} keyboardType="number-pad" textContentType="oneTimeCode" autoComplete="sms-otp" maxLength={OTP_LENGTH} autoFocus style={styles.hiddenInput} />
          </TouchableOpacity>
          {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
          <View style={styles.resendRow}>
            <Text style={styles.resendLabel}>Didn’t receive the code? </Text>
            <TouchableOpacity accessibilityLabel="Resend OTP" disabled={seconds > 0 || submitting} onPress={resendOtp}>
              <Text style={[styles.resend, seconds > 0 && styles.resendDisabled]}>{seconds > 0 ? `Resend in 00:${String(seconds).padStart(2, '0')}` : 'Resend OTP'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Verify and continue" disabled={submitting || otp.length !== OTP_LENGTH} activeOpacity={0.85} style={[styles.button, (submitting || otp.length !== OTP_LENGTH) && styles.buttonDisabled]} onPress={verifyOtp}>{submitting ? <ActivityIndicator color="#fff" accessibilityLabel="Please wait" /> : <Text style={styles.buttonText}>Verify & Continue</Text>}</TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OtpScreen;

const createStyles = colors => StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.surface}, keyboardView: {flex: 1},
  backButton: {width: 44, height: 44, marginTop: 12, marginLeft: 16, alignItems: 'center', justifyContent: 'center'},
  content: {flex: 1, paddingHorizontal: 24, paddingTop: 34},
  iconWrap: {width: 76, height: 76, borderRadius: 38, backgroundColor: colors.accentSurface, alignItems: 'center', justifyContent: 'center', marginBottom: 28},
  title: {fontSize: 28, lineHeight: 35, fontWeight: '800', color: colors.text}, subtitle: {fontSize: 15, color: colors.textMuted, marginTop: 10},
  numberRow: {flexDirection: 'row', alignItems: 'center', marginTop: 6}, number: {fontSize: 15, fontWeight: '700', color: colors.text},
  change: {fontSize: 14, fontWeight: '700', color: '#ef4444', marginLeft: 12}, otpRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 38},
  otpBox: {width: '14%', height: 56, borderRadius: 14, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center'},
  otpBoxActive: {borderColor: '#ef4444', backgroundColor: colors.surface}, otpBoxError: {borderColor: '#ef4444'}, otpDigit: {fontSize: 24, fontWeight: '800', color: colors.text},
  hiddenInput: {position: 'absolute', width: 1, height: 1, opacity: 0}, error: {fontSize: 13, color: '#ef4444', marginTop: 10},
  resendRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 26}, resendLabel: {fontSize: 14, color: colors.textMuted},
  resend: {fontSize: 14, color: '#ef4444', fontWeight: '700'}, resendDisabled: {color: colors.textMuted}, footer: {paddingHorizontal: 24, paddingBottom: 24},
  button: {height: 56, borderRadius: 14, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center', elevation: 3},
  buttonDisabled: {backgroundColor: '#fca5a5', elevation: 0}, buttonText: {fontSize: 17, fontWeight: '700', color: '#fff'},
});
