import {colors} from '../../theme/colors';
import React, {useEffect, useRef, useState} from 'react';
import {KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const OTP_LENGTH = 4;
const DUMMY_OTP = '1234';

const OtpScreen = ({navigation, route, setIsLoggedIn}) => {
  const [otp, setOtp] = useState(DUMMY_OTP);
  const [seconds, setSeconds] = useState(30);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const mobileNumber = route.params?.mobileNumber || '';

  useEffect(() => {
    if (seconds === 0) return undefined;
    const timer = setTimeout(() => setSeconds(value => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const verifyOtp = () => {
    if (otp.length !== OTP_LENGTH) {
      setError('Please enter the complete 4-digit OTP.');
      return;
    }
    setError('');
    setIsLoggedIn(true);
  };

  const resendOtp = () => {
    if (seconds > 0) return;
    setOtp(''); setError(''); setSeconds(30); inputRef.current?.focus();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}><Icon name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
        <View style={styles.content}>
          <View style={styles.iconWrap}><Icon name="shield-checkmark-outline" size={42} color="#ef4444" /></View>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>Enter the 4-digit code sent to</Text>
          <View style={styles.numberRow}>
            <Text style={styles.number}>+91 {mobileNumber}</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.change}>Change</Text></TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={1} style={styles.otpRow} onPress={() => inputRef.current?.focus()}>
            {Array.from({length: OTP_LENGTH}).map((_, index) => (
              <View key={index} style={[styles.otpBox, otp.length === index && styles.otpBoxActive, error ? styles.otpBoxError : null]}><Text style={styles.otpDigit}>{otp[index] || ''}</Text></View>
            ))}
            <TextInput ref={inputRef} value={otp} onChangeText={value => {setOtp(value.replace(/[^0-9]/g, '').slice(0, OTP_LENGTH)); if (error) setError('');}} keyboardType="number-pad" maxLength={OTP_LENGTH} autoFocus style={styles.hiddenInput} />
          </TouchableOpacity>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <View style={styles.resendRow}>
            <Text style={styles.resendLabel}>Didn’t receive the code? </Text>
            <TouchableOpacity disabled={seconds > 0} onPress={resendOtp}>
              <Text style={[styles.resend, seconds > 0 && styles.resendDisabled]}>{seconds > 0 ? `Resend in 00:${String(seconds).padStart(2, '0')}` : 'Resend OTP'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity activeOpacity={0.85} style={[styles.button, otp.length !== OTP_LENGTH && styles.buttonDisabled]} onPress={verifyOtp}><Text style={styles.buttonText}>Verify & Continue</Text></TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.surface}, keyboardView: {flex: 1},
  backButton: {width: 44, height: 44, marginTop: 12, marginLeft: 16, alignItems: 'center', justifyContent: 'center'},
  content: {flex: 1, paddingHorizontal: 24, paddingTop: 34},
  iconWrap: {width: 76, height: 76, borderRadius: 38, backgroundColor: '#fff1f2', alignItems: 'center', justifyContent: 'center', marginBottom: 28},
  title: {fontSize: 28, lineHeight: 35, fontWeight: '800', color: colors.text}, subtitle: {fontSize: 15, color: colors.textMuted, marginTop: 10},
  numberRow: {flexDirection: 'row', alignItems: 'center', marginTop: 6}, number: {fontSize: 15, fontWeight: '700', color: colors.text},
  change: {fontSize: 14, fontWeight: '700', color: '#ef4444', marginLeft: 12}, otpRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 38},
  otpBox: {width: 62, height: 62, borderRadius: 14, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center'},
  otpBoxActive: {borderColor: '#ef4444', backgroundColor: colors.surface}, otpBoxError: {borderColor: '#ef4444'}, otpDigit: {fontSize: 24, fontWeight: '800', color: colors.text},
  hiddenInput: {position: 'absolute', width: 1, height: 1, opacity: 0}, error: {fontSize: 13, color: '#ef4444', marginTop: 10},
  resendRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 26}, resendLabel: {fontSize: 14, color: colors.textMuted},
  resend: {fontSize: 14, color: '#ef4444', fontWeight: '700'}, resendDisabled: {color: colors.textMuted}, footer: {paddingHorizontal: 24, paddingBottom: 24},
  button: {height: 56, borderRadius: 14, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center', elevation: 3},
  buttonDisabled: {backgroundColor: '#fca5a5', elevation: 0}, buttonText: {fontSize: 17, fontWeight: '700', color: '#fff'},
});
