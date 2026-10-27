/* eslint-env jest */
import React from 'react';
import {act, create} from 'react-test-renderer';
import {Text, TextInput, TouchableOpacity} from 'react-native';
import OtpScreen from '../src/screens/authScreen/OtpScreen';
import {useSendOtpMutation, useVerifyOtpMutation} from '../src/redux/api';

jest.mock('@react-native-async-storage/async-storage', () => ({getItem: jest.fn(), setItem: jest.fn()}));
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native-keychain', () => ({}));
jest.mock('../src/redux/api', () => ({useSendOtpMutation: jest.fn(), useVerifyOtpMutation: jest.fn()}));
const session = {accessToken: 'test-access', refreshToken: 'test-refresh', accessTokenExpiresAt: '2099-01-01T00:00:00Z'};
let verify;
let send;
beforeEach(() => {
  jest.useFakeTimers();
  verify = jest.fn(() => ({unwrap: () => Promise.resolve({success: true, data: session})}));
  send = jest.fn(() => ({unwrap: () => Promise.resolve({success: true, otp: '654321'})}));
  useVerifyOtpMutation.mockImplementation(() => [verify, {reset: jest.fn()}]);
  useSendOtpMutation.mockImplementation(() => [send, {reset: jest.fn()}]);
});
afterEach(() => {jest.clearAllTimers(); jest.useRealTimers();});
const button = (tree, label) => tree.root.findAllByType(TouchableOpacity).find(node => node.props.accessibilityLabel === label);
const render = login => create(<OtpScreen navigation={{goBack: jest.fn()}} route={{params: {mobileNumber: '9000000000'}}} setIsLoggedIn={login} />);
const enterOtp = async tree => {await act(async () => tree.root.findByType(TextInput).props.onChangeText('247710'));};
const expireCountdown = async () => {
  for (let i = 0; i < 30; i++) {await act(async () => jest.advanceTimersByTime(1000));}
};
test('starts empty, requires 6 digits and signs in only after server verification', async () => {
  const login = jest.fn().mockResolvedValue(undefined);
  let tree;
  await act(async () => {tree = render(login);});
  expect(tree.root.findByType(TextInput).props.value).toBe('');
  expect(button(tree, 'Verify and continue').props.disabled).toBe(true);
  await enterOtp(tree);
  await act(async () => button(tree, 'Verify and continue').props.onPress());
  expect(verify).toHaveBeenCalledWith({mobileNo: '9000000000', OTP: '247710'});
  expect(login).toHaveBeenCalledWith(session);
  await act(async () => tree.unmount());
});
test('fills and displays the received OTP, preserving leading zeros without auto-verifying', async () => {
  let tree;
  await act(async () => {
    tree = create(<OtpScreen navigation={{goBack: jest.fn()}} route={{params: {mobileNumber: '9000000000', otp: '001234'}}} setIsLoggedIn={jest.fn()} />);
  });
  expect(tree.root.findByType(TextInput).props.value).toBe('001234');
  expect(tree.root.findAllByType(Text).filter(text => text.props.style?.fontSize === 24).map(text => text.props.children).join('')).toBe('001234');
  expect(verify).not.toHaveBeenCalled();
  expect(button(tree, 'Verify and continue').props.disabled).toBe(false);
  await act(async () => tree.unmount());
});
test.each(['bad-code', '12345'])('ignores an invalid returned OTP: %s', async otp => {
  let tree;
  await act(async () => {
    tree = create(<OtpScreen navigation={{goBack: jest.fn()}} route={{params: {mobileNumber: '9000000000', otp}}} setIsLoggedIn={jest.fn()} />);
  });
  expect(tree.root.findByType(TextInput).props.value).toBe('');
  await act(async () => tree.unmount());
});
test.each([
  ['incorrect code', () => Promise.resolve({success: false, message: 'Invalid OTP'})],
  ['missing tokens', () => Promise.resolve({success: true, data: {}})],
  ['network failure', () => Promise.reject({status: 'FETCH_ERROR'})],
])('does not sign in on %s', async (_label, unwrap) => {
  verify.mockReturnValue({unwrap});
  const login = jest.fn();
  let tree;
  await act(async () => {tree = render(login);});
  await enterOtp(tree);
  await act(async () => button(tree, 'Verify and continue').props.onPress());
  expect(login).not.toHaveBeenCalled();
  expect(tree.root.findAllByType(Text).some(text => text.props.accessibilityRole === 'alert')).toBe(true);
  await act(async () => tree.unmount());
});
test('resends after cooldown and fills the new OTP returned by the server', async () => {
  let tree;
  await act(async () => {tree = render(jest.fn());});
  await enterOtp(tree);
  await act(async () => button(tree, 'Resend OTP').props.onPress());
  expect(send).not.toHaveBeenCalled();
  await expireCountdown();
  await act(async () => button(tree, 'Resend OTP').props.onPress());
  expect(send).toHaveBeenCalledWith({mobileNo: '9000000000'});
  expect(tree.root.findByType(TextInput).props.value).toBe('654321');
  expect(button(tree, 'Resend OTP').props.disabled).toBe(true);
  await act(async () => tree.unmount());
});
test('a failed resend permits retry and a failed session save stays on verification', async () => {
  send.mockReturnValueOnce({unwrap: () => Promise.reject({status: 'FETCH_ERROR'})});
  let tree;
  const login = jest.fn().mockRejectedValue(new Error('Storage unavailable'));
  await act(async () => {tree = render(login);});
  await expireCountdown();
  await act(async () => button(tree, 'Resend OTP').props.onPress());
  expect(button(tree, 'Resend OTP').props.disabled).toBe(false);
  await enterOtp(tree);
  await act(async () => button(tree, 'Verify and continue').props.onPress());
  expect(button(tree, 'Verify and continue').props.disabled).toBe(false);
  expect(tree.root.findAllByType(Text).some(text => text.props.accessibilityRole === 'alert')).toBe(true);
  await act(async () => tree.unmount());
});
