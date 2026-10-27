/* eslint-env jest */
import {api, BASE_URL, useGetVehiclesQuery} from '../src/redux/api';
jest.mock('react-native-keychain', () => ({}));
import {store} from '../src/redux/store';
import {setSession} from '../src/redux/authSlice';

const originalFetch = global.fetch;
beforeEach(() => {jest.useFakeTimers();});
afterEach(() => {
  store.dispatch(api.util.resetApiState());
  store.dispatch(setSession(null));
  global.fetch = originalFetch;
  jest.clearAllTimers();
  jest.useRealTimers();
});

test('registration posts the exact fields and protected requests use the saved token', async () => {
  const body = {FirstName: 'Test', LastName: 'Customer', mobileNo: '9000000000', Email: 'test@example.invalid'};
  global.fetch = jest.fn().mockImplementation(async () => new global.Response(JSON.stringify({success: true}), {
    status: 200, headers: {'Content-Type': 'application/json'},
  }));
  store.dispatch(setSession({accessToken: 'test-access-token'}));
  const registration = store.dispatch(api.endpoints.registerUser.initiate(body));
  await registration.unwrap();
  const request = global.fetch.mock.calls[0][0];
  expect(request.url).toBe(`${BASE_URL}AuthCustomer/RegisterUser`);
  expect(request.method).toBe('POST');
  expect(JSON.parse(await request.clone().text())).toEqual(body);
  expect(request.headers.get('Authorization')).toBeNull();
  registration.reset();
  const vehicles = store.dispatch(api.endpoints.getVehicles.initiate());
  await vehicles.unwrap();
  expect(global.fetch.mock.calls[1][0].headers.get('Authorization')).toBe('Bearer test-access-token');
  vehicles.unsubscribe();
});

test.each([
  ['sendOtp', 'AuthCustomer/SendOtp', {mobileNo: '9000000000'}],
  ['verifyOtp', 'AuthCustomer/verifyotp', {mobileNo: '9000000000', OTP: '247710'}],
  ['refreshToken', 'AuthCustomer/refreshtoken', {refreshToken: 'test-refresh-token'}],
])('%s posts the documented fields without a bearer header', async (endpoint, path, body) => {
  store.dispatch(setSession({accessToken: 'test-access-token'}));
  global.fetch = jest.fn().mockImplementation(async () => new global.Response(JSON.stringify({success: true}), {
    status: 200, headers: {'Content-Type': 'application/json'},
  }));
  const mutation = store.dispatch(api.endpoints[endpoint].initiate(body));
  await mutation.unwrap();
  const request = global.fetch.mock.calls[0][0];
  expect(request.url).toBe(`${BASE_URL}${path}`);
  expect(request.method).toBe('POST');
  expect(request.headers.get('Content-Type')).toContain('application/json');
  expect(request.headers.get('Authorization')).toBeNull();
  expect(JSON.parse(await request.clone().text())).toEqual(body);
  mutation.reset();
});

test('uses the configured URL and filters, stores data and reuses the cache', async () => {
  const vehicles = [{id: 1, title: 'Test vehicle'}];
  global.fetch = jest.fn().mockResolvedValue(new global.Response(JSON.stringify(vehicles), {
    status: 200, headers: {'Content-Type': 'application/json'},
  }));
  const request = store.dispatch(api.endpoints.getVehicles.initiate({page: 1}));
  try {
    await expect(request.unwrap()).resolves.toEqual(vehicles);
    expect(global.fetch.mock.calls[0][0].url).toBe(`${BASE_URL}vehicles?page=1`);
    expect(api.endpoints.getVehicles.select({page: 1})(store.getState()).data).toEqual(vehicles);
    const cached = store.dispatch(api.endpoints.getVehicles.initiate({page: 1}));
    await expect(cached.unwrap()).resolves.toEqual(vehicles);
    cached.unsubscribe();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(typeof useGetVehiclesQuery).toBe('function');
  } finally {
    request.unsubscribe();
  }
});

test('exposes HTTP errors to screens', async () => {
  global.fetch = jest.fn().mockResolvedValue(new global.Response(JSON.stringify({message: 'Unavailable'}), {
    status: 503, headers: {'Content-Type': 'application/json'},
  }));
  const request = store.dispatch(api.endpoints.getVehicles.initiate());
  try {
    await expect(request.unwrap()).rejects.toMatchObject({status: 503});
  } finally {
    request.unsubscribe();
  }
});

test.each([
  ['getCountries', undefined, 'Master/Country', 'GET'],
  ['getStates', 1, 'Master/State?CountryID=1', 'POST'],
  ['getCities', 1, 'Master/City?stateid=1', 'POST'],
  ['getAreas', 1, 'Master/AreaName?cityid=1', 'POST'],
])('%s uses the documented method and parameter casing', async (endpoint, id, path, method) => {
  const payload = {success: true, data: []};
  global.fetch = jest.fn(async () => new global.Response(JSON.stringify(payload), {
    status: 200, headers: {'Content-Type': 'application/json'},
  }));
  const request = store.dispatch(api.endpoints[endpoint].initiate(id));
  await expect(request.unwrap()).resolves.toEqual(payload);
  const sent = global.fetch.mock.calls[0][0];
  expect(sent.url).toBe(`${BASE_URL}${path}`);
  expect(sent.method).toBe(method);
  expect(await sent.clone().text()).toBe('');
  request.unsubscribe();
});
