/* eslint-env jest */
import React, {useState} from 'react';
import {act, create} from 'react-test-renderer';
import {Text, TouchableOpacity} from 'react-native';
import LocationFields from '../src/components/LocationFields';
import {useGetAreasQuery, useGetCitiesQuery, useGetCountriesQuery, useGetStatesQuery} from '../src/redux/api';

jest.mock('@react-native-async-storage/async-storage', () => ({getItem: jest.fn()}));
jest.mock('../src/redux/api', () => ({useGetCountriesQuery: jest.fn(), useGetStatesQuery: jest.fn(), useGetCitiesQuery: jest.fn(), useGetAreasQuery: jest.fn()}));
const result = data => ({currentData: {success: true, data}, refetch: jest.fn()});
const complete = {countryId: 1, countryName: 'India', stateId: 1, stateName: 'Maharashtra', cityId: 1, cityName: 'Nagpur', areaId: 10, areaName: 'Ayodhya Nagar', pincode: '440024'};
beforeEach(() => {
  jest.clearAllMocks();
  useGetCountriesQuery.mockReturnValue(result([{CountryID: 1, CountryName: 'India'}, {CountryID: 2, CountryName: 'Other Country'}]));
  useGetStatesQuery.mockReturnValue(result([{StateID: 1, StateName: 'Maharashtra'}, {StateID: 2, StateName: 'Other State'}]));
  useGetCitiesQuery.mockReturnValue(result([{CityID: 1, CityName: 'Nagpur'}, {CityID: 2, CityName: 'Other City'}]));
  useGetAreasQuery.mockReturnValue(result([{AreaID: 10, AreaName: 'Ayodhya Nagar', Pincode: '440024'}]));
});
const button = (tree, label) => tree.root.findAllByType(TouchableOpacity).find(node => node.props.accessibilityLabel === label);
const press = async (tree, label) => {await act(async () => button(tree, label).props.onPress());};
let selected;
const Form = ({initial = {}}) => {
  const [value, setValue] = useState(initial);
  selected = value;
  return <LocationFields value={value} onChange={setValue} />;
};
test('loads children only after selecting their parent and saves the API IDs and pincode', async () => {
  let tree;
  await act(async () => {tree = create(<Form />);});
  expect(button(tree, 'Select State').props.disabled).toBe(true);
  expect(useGetStatesQuery).toHaveBeenLastCalledWith(undefined, {skip: true});
  expect(useGetCitiesQuery).toHaveBeenLastCalledWith(undefined, {skip: true});
  expect(useGetAreasQuery).toHaveBeenLastCalledWith(undefined, {skip: true});
  for (const label of ['Select Country', 'Country: India', 'Select State', 'State: Maharashtra', 'Select City', 'City: Nagpur', 'Select Area', 'Area: Ayodhya Nagar']) {await press(tree, label);}
  expect(selected).toEqual(complete);
  expect(useGetStatesQuery).toHaveBeenLastCalledWith(1, {skip: false});
  expect(useGetCitiesQuery).toHaveBeenLastCalledWith(1, {skip: false});
  expect(useGetAreasQuery).toHaveBeenLastCalledWith(1, {skip: false});
  await act(async () => tree.unmount());
});
test.each([
  ['City', 'Other City', {countryId: 1, countryName: 'India', stateId: 1, stateName: 'Maharashtra', cityId: 2, cityName: 'Other City'}],
  ['State', 'Other State', {countryId: 1, countryName: 'India', stateId: 2, stateName: 'Other State'}],
  ['Country', 'Other Country', {countryId: 2, countryName: 'Other Country'}],
])('changing %s clears all dependent selections', async (label, name, expected) => {
  let tree;
  await act(async () => {tree = create(<Form initial={complete} />);});
  await press(tree, `Select ${label}`);
  await press(tree, `${label}: ${name}`);
  expect(selected).toEqual(expected);
  await act(async () => tree.unmount());
});
test('shows loading, retry and empty states without exposing stale query data', async () => {
  const refetch = jest.fn();
  useGetStatesQuery.mockReturnValue({isError: true, refetch});
  let tree;
  await act(async () => {tree = create(<Form initial={{countryId: 1, countryName: 'India'}} />);});
  await press(tree, 'Retry State');
  expect(refetch).toHaveBeenCalledTimes(1);
  useGetStatesQuery.mockReturnValue({isFetching: true, data: {success: true, data: [{StateID: 99, StateName: 'Old state'}]}});
  await press(tree, 'Select State');
  expect(tree.root.findAllByType(Text).some(text => text.props.children === 'Old state')).toBe(false);
  useGetStatesQuery.mockReturnValue(result([]));
  await act(async () => tree.update(<Form initial={{countryId: 1, countryName: 'India'}} />));
  expect(tree.root.findAllByType(Text).some(text => React.Children.toArray(text.props.children).join('') === 'No state options available.')).toBe(true);
  await act(async () => tree.unmount());
});
test.each([{success: false}, {success: true, data: [null]}])('reports invalid responses and disables selections while saving: %j', async currentData => {
  useGetCountriesQuery.mockReturnValue({currentData, refetch: jest.fn()});
  let tree;
  await act(async () => {tree = create(<LocationFields value={complete} disabled onChange={jest.fn()} />);});
  expect(button(tree, 'Select Country').props.disabled).toBe(true);
  expect(button(tree, 'Select Area').props.disabled).toBe(true);
  expect(button(tree, 'Retry Country').props.disabled).toBe(true);
  await act(async () => tree.unmount());
});
