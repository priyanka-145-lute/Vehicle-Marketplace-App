/* eslint-env jest */
import React from 'react';
import {act, create} from 'react-test-renderer';
import {Text, TextInput, TouchableOpacity} from 'react-native';
import LoginScreen from '../src/screens/authScreen/LoginScreen';
import {useRegisterUserMutation, useSendOtpMutation} from '../src/redux/api';

jest.mock('@react-native-async-storage/async-storage', () => ({getItem: jest.fn(), setItem: jest.fn()}));
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('../src/redux/api', () => ({useRegisterUserMutation: jest.fn(), useSendOtpMutation: jest.fn()}));
let register;
let send;
const success = () => ({unwrap: () => Promise.resolve({success: true})});
beforeEach(() => {
  register = jest.fn(success);
  send = jest.fn(() => ({unwrap: () => Promise.resolve({success: true, otp: '247710'})}));
  useRegisterUserMutation.mockImplementation(() => [register, {reset: jest.fn()}]);
  useSendOtpMutation.mockImplementation(() => [send, {reset: jest.fn()}]);
});
const button = (tree, label) => tree.root.findAllByType(TouchableOpacity).find(node => node.props.accessibilityLabel === label);
const submit = tree => button(tree, 'Continue with OTP').props.onPress();
const fill = async tree => {
  for (const [label, value] of [['First Name', ' Test '], ['Last Name', ' User '], ['Mobile Number', '9000000000'], ['Email Address', ' test@example.invalid ']]) {
    await act(async () => tree.root.findAllByType(TextInput).find(input => input.props.accessibilityLabel === label).props.onChangeText(value));
  }
};
test('validates registration then sends OTP and opens verification', async () => {
  const navigation = {navigate: jest.fn()};
  let tree;
  await act(async () => {tree = create(<LoginScreen navigation={navigation} />);});
  await act(async () => submit(tree));
  expect(register).not.toHaveBeenCalled();
  await fill(tree);
  await act(async () => submit(tree));
  expect(register).toHaveBeenCalledWith({FirstName: 'Test', LastName: 'User', mobileNo: '9000000000', Email: 'test@example.invalid'});
  expect(send).toHaveBeenCalledWith({mobileNo: '9000000000'});
  expect(navigation.navigate).toHaveBeenCalledWith('Otp', {mobileNumber: '9000000000', otp: '247710'});
  await act(async () => tree.unmount());
});
test('existing customers send OTP with only their mobile number', async () => {
  const navigation = {navigate: jest.fn()};
  let tree;
  await act(async () => {tree = create(<LoginScreen navigation={navigation} />);});
  await act(async () => button(tree, 'Switch sign-in mode').props.onPress());
  expect(tree.root.findAllByType(TextInput)).toHaveLength(1);
  await act(async () => tree.root.findByType(TextInput).props.onChangeText('9000000000'));
  await act(async () => submit(tree));
  expect(register).not.toHaveBeenCalled();
  expect(send).toHaveBeenCalledWith({mobileNo: '9000000000'});
  expect(navigation.navigate).toHaveBeenCalledWith('Otp', {mobileNumber: '9000000000', otp: '247710'});
  await act(async () => tree.unmount());
});
test.each([
  ['business error', () => Promise.resolve({success: false, message: 'Registration unavailable'})],
  ['network error', () => Promise.reject({status: 'FETCH_ERROR'})],
])('does not send OTP when registration returns %s', async (_label, unwrap) => {
  register.mockReturnValue({unwrap});
  const navigation = {navigate: jest.fn()};
  let tree;
  await act(async () => {tree = create(<LoginScreen navigation={navigation} />);});
  await fill(tree);
  await act(async () => submit(tree));
  expect(send).not.toHaveBeenCalled();
  expect(navigation.navigate).not.toHaveBeenCalled();
  expect(tree.root.findAllByType(Text).some(text => text.props.accessibilityRole === 'alert')).toBe(true);
  await act(async () => tree.unmount());
});
test('retries failed OTP delivery without registering the user twice', async () => {
  send.mockReturnValueOnce({unwrap: () => Promise.resolve({success: false, message: 'Try later'})});
  const navigation = {navigate: jest.fn()};
  let tree;
  await act(async () => {tree = create(<LoginScreen navigation={navigation} />);});
  await fill(tree);
  await act(async () => submit(tree));
  expect(navigation.navigate).not.toHaveBeenCalled();
  await act(async () => submit(tree));
  expect(register).toHaveBeenCalledTimes(1);
  expect(send).toHaveBeenCalledTimes(2);
  expect(navigation.navigate).toHaveBeenCalled();
  await act(async () => tree.unmount());
});
test('blocks repeated submits while registering', async () => {
  let resolve;
  register.mockReturnValue({unwrap: () => new Promise(done => {resolve = done;})});
  let tree;
  await act(async () => {tree = create(<LoginScreen navigation={{navigate: jest.fn()}} />);});
  await fill(tree);
  let pending;
  await act(async () => {pending = submit(tree); submit(tree);});
  expect(register).toHaveBeenCalledTimes(1);
  await act(async () => {resolve({success: false}); await pending;});
  await act(async () => tree.unmount());
});
