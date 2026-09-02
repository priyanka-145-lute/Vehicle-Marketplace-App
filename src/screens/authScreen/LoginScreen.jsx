import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const LoginScreen = ({navigation}) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (mobileNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    navigation.navigate('Otp', {mobileNumber});
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}><Icon name="arrow-back" size={24} color="#111827" /></TouchableOpacity>
        <View style={styles.content}>
          <View style={styles.iconWrap}><Icon name="phone-portrait-outline" size={42} color="#ef4444" /></View>
          <Text style={styles.title}>Enter your mobile number</Text>
          <Text style={styles.subtitle}>We’ll send you a one-time verification code to confirm your number.</Text>
          <Text style={styles.label}>Mobile Number</Text>
          <View style={[styles.inputWrap, error ? styles.inputError : null]}>
            <Text style={styles.countryCode}>+91</Text><View style={styles.divider} />
            <TextInput value={mobileNumber} onChangeText={value => {setMobileNumber(value.replace(/[^0-9]/g, '').slice(0, 10)); if (error) setError('');}} placeholder="Enter 10-digit number" placeholderTextColor="#94a3b8" keyboardType="number-pad" maxLength={10} autoFocus style={styles.input} />
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
        <View style={styles.footer}>
          <TouchableOpacity activeOpacity={0.85} style={[styles.button, mobileNumber.length !== 10 && styles.buttonDisabled]} onPress={handleContinue}><Text style={styles.buttonText}>Send OTP</Text></TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'}, keyboardView: {flex: 1},
  backButton: {width: 44, height: 44, marginTop: 12, marginLeft: 16, alignItems: 'center', justifyContent: 'center'},
  content: {flex: 1, paddingHorizontal: 24, paddingTop: 34},
  iconWrap: {width: 76, height: 76, borderRadius: 38, backgroundColor: '#fff1f2', alignItems: 'center', justifyContent: 'center', marginBottom: 28},
  title: {fontSize: 28, lineHeight: 35, fontWeight: '800', color: '#111827'},
  subtitle: {fontSize: 15, lineHeight: 23, color: '#64748b', marginTop: 10, marginBottom: 34},
  label: {fontSize: 14, fontWeight: '700', color: '#334155', marginBottom: 9},
  inputWrap: {height: 58, borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 14, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, backgroundColor: '#f8fafc'},
  inputError: {borderColor: '#ef4444'}, countryCode: {fontSize: 16, fontWeight: '700', color: '#111827'},
  divider: {height: 26, width: 1, backgroundColor: '#cbd5e1', marginHorizontal: 14}, input: {flex: 1, fontSize: 16, color: '#111827', paddingVertical: 0},
  error: {fontSize: 13, color: '#ef4444', marginTop: 8}, footer: {paddingHorizontal: 24, paddingBottom: 24},
  button: {height: 56, borderRadius: 14, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center', elevation: 3},
  buttonDisabled: {backgroundColor: '#fca5a5', elevation: 0}, buttonText: {fontSize: 17, fontWeight: '700', color: '#fff'},
});
