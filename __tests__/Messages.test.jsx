/* eslint-env jest */
import React from 'react';
import {act, create} from 'react-test-renderer';
import {Text, TextInput, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MessageScreen from '../src/screens/MessageScreen';

jest.mock('@react-native-async-storage/async-storage', () => ({getItem: jest.fn().mockResolvedValue(null), setItem: jest.fn().mockResolvedValue(undefined)}));
jest.mock('react-native-safe-area-context', () => ({SafeAreaView: require('react-native').View}));
const findButton = (tree, label) => tree.root.findAllByType(TouchableOpacity).find(node => node.props.accessibilityLabel === label || node.findAllByType(Text).some(text => text.props.children === label));
const press = async (tree, label) => {await act(async () => findButton(tree, label).props.onPress());};
const fill = async (tree, label, value) => {await act(async () => tree.root.findAllByType(TextInput).find(node => node.props.accessibilityLabel === label).props.onChangeText(value));};

test('creates a conversation, saves unsent drafts, searches and restores them', async () => {
  let tree;
  await act(async () => {tree = create(<MessageScreen />);});
  await press(tree, 'New conversation');
  await press(tree, 'Create Draft Conversation');
  expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  await fill(tree, 'Contact name', 'Asha');
  await fill(tree, 'Vehicle', 'Honda City');
  await press(tree, 'Create Draft Conversation');
  expect(findButton(tree, 'Save Draft').props.disabled).toBe(true);
  await fill(tree, 'Message draft', 'Is this vehicle available?');
  await press(tree, 'Save Draft');
  const saved = AsyncStorage.setItem.mock.calls.at(-1)[1];
  expect(JSON.parse(saved)[0].drafts[0].text).toBe('Is this vehicle available?');
  await press(tree, 'Back to messages');
  await fill(tree, 'Search conversations', 'missing');
  expect(tree.root.findAllByType(Text).some(node => node.props.children === 'No conversations found')).toBe(true);
  await act(async () => tree.unmount());
  AsyncStorage.getItem.mockResolvedValue(saved);
  await act(async () => {tree = create(<MessageScreen />);});
  await press(tree, 'Asha');
  expect(tree.root.findAllByType(Text).some(node => node.props.children === 'Is this vehicle available?')).toBe(true);
  await act(async () => tree.unmount());
});
