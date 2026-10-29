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
  ['getUserAddressById', 'AuthCustomer/UserAddressById', {AddressID: '4'}],
  ['updateAddress', 'AuthCustomer/UpdateAddress', {AddressID: '2', AddressType: 'WORK', AddressLine1: 'Updated road', AddressLine2: '', Landmark: 'Hudkeshwar', Pincode: '440022', Latitude: '21.0898000', Longitude: '79.1350000'}],
  ['deleteAddress', 'AuthCustomer/UserDeleteAddressById', {AddressID: '4'}],
])('%s posts the exact address fields with the session token', async (endpoint, path, body) => {
  store.dispatch(setSession({accessToken: 'address-session-token'}));
  global.fetch = jest.fn(async () => new global.Response(JSON.stringify({success: true}), {status: 200, headers: {'Content-Type': 'application/json'}}));
  const mutation = store.dispatch(api.endpoints[endpoint].initiate(body));
  await mutation.unwrap();
  const sent = global.fetch.mock.calls[0][0];
  expect(sent.url).toBe(`${BASE_URL}${path}`);
  expect(sent.method).toBe('POST');
  expect(sent.headers.get('Authorization')).toBe('Bearer address-session-token');
  expect(JSON.parse(await sent.clone().text())).toEqual(body);
  mutation.reset();
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

test('logout uses the saved refresh token in the header and exact RefreshToken field without refreshing on 401', async () => {
  store.dispatch(setSession({accessToken: 'access-token', refreshToken: 'refresh-token=='}));
  global.fetch = jest.fn(async () => new global.Response(JSON.stringify({message: 'Rejected'}), {status: 401, headers: {'Content-Type': 'application/json'}}));
  const mutation = store.dispatch(api.endpoints.logout.initiate({RefreshToken: 'refresh-token=='}));
  await expect(mutation.unwrap()).rejects.toMatchObject({status: 401});
  expect(global.fetch).toHaveBeenCalledTimes(1);
  const sent = global.fetch.mock.calls[0][0];
  expect(sent.url).toBe(`${BASE_URL}AuthCustomer/logout`);
  expect(sent.method).toBe('POST');
  expect(sent.headers.get('Authorization')).toBe('Bearer refresh-token==');
  expect(JSON.parse(await sent.clone().text())).toEqual({RefreshToken: 'refresh-token=='});
  mutation.reset();
});

test('profile GET preserves backend data and uses the active bearer token', async () => {
  const payload = {success: true, data: [{UserID: 10, FirstName: 'Test', LastName: 'Customer', MobileNo: '9000000000', Email: '', Status: 'ACTIVE'}]};
  global.fetch = jest.fn(async () => new global.Response(JSON.stringify(payload), {status: 200, headers: {'Content-Type': 'application/json'}}));
  store.dispatch(setSession({accessToken: 'profile-session-token'}));
  const request = store.dispatch(api.endpoints.getProfile.initiate());
  await expect(request.unwrap()).resolves.toEqual(payload);
  const sent = global.fetch.mock.calls[0][0];
  expect(sent.url).toBe(`${BASE_URL}AuthCustomer/profile`);
  expect(sent.method).toBe('GET');
  expect(sent.headers.get('Authorization')).toBe('Bearer profile-session-token');
  expect(await sent.clone().text()).toBe('');
  request.unsubscribe();
});

test('address GET sends the current session token without a request body', async () => {
  const payload = {success: true, data: [{AddressID: 3, AddressLine1: 'BAJRANG NAGAR', IsDefault: false}]};
  global.fetch = jest.fn(async () => new global.Response(JSON.stringify(payload), {status: 200, headers: {'Content-Type': 'application/json'}}));
  for (const token of ['first-address-token', 'next-address-token']) {
    store.dispatch(setSession({accessToken: token}));
    const request = store.dispatch(api.endpoints.getUserAddresses.initiate(undefined, {forceRefetch: true}));
    await expect(request.unwrap()).resolves.toEqual(payload);
    const sent = global.fetch.mock.calls.at(-1)[0];
    expect(sent.url).toBe(`${BASE_URL}AuthCustomer/UserAddress`);
    expect(sent.method).toBe('GET');
    expect(sent.headers.get('Authorization')).toBe(`Bearer ${token}`);
    expect(await sent.clone().text()).toBe('');
    request.unsubscribe();
  }
});

test.each([
  ['getCountries', undefined, 'Master/Country', 'GET'],
  ['getVehicleTypes', undefined, 'Master/VehicalType', 'GET'],
  ['getStates', 1, 'Master/State?CountryID=1', 'POST'],
  ['getCities', 1, 'Master/City?stateid=1', 'POST'],
  ['getAreas', 1, 'Master/AreaName?cityid=1', 'POST'],
  ['getVehicleCategories', 2000, 'Master/CategoryByVehicaltype?typeid=2000', 'POST'],
  ['getVehicleCategories', 5678, 'Master/CategoryByVehicaltype?typeid=5678', 'POST'],
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

test('banner GET uses the active session token and preserves exact backend fields', async () => {
  const payload = {success: true, message: 'Data retrieved successfully', data: [{BANCODE: 51, BNAME: 'new banner', BURL: null, IMG: 'new_banner_51.jpg', PLACEMENT: 'Top', APAGE: 'Index', APP: 'User'}]};
  global.fetch = jest.fn(async () => new global.Response(JSON.stringify(payload), {
    status: 200, headers: {'Content-Type': 'application/json'},
  }));
  for (const token of ['first-session-token', 'second-session-token']) {
    store.dispatch(setSession({accessToken: token}));
    const request = store.dispatch(api.endpoints.getBanners.initiate(undefined, {forceRefetch: true}));
    await expect(request.unwrap()).resolves.toEqual(payload);
    const sent = global.fetch.mock.calls.at(-1)[0];
    expect(sent.url).toBe(`${BASE_URL}Master/Banner`);
    expect(sent.method).toBe('GET');
    expect(await sent.clone().text()).toBe('');
    expect(sent.headers.get('Authorization')).toBe(`Bearer ${token}`);
    request.unsubscribe();
  }
});

test('brand GET uses session authorization without adding request parameters or changing response fields', async () => {
  const payload = {success: true, data: [{VehicleBrandId: 2003, VEHICLETYPEID: 2000, VEHICLETYPENAME: 'Car', BrandCode: 'VB2000', BrandName: 'Tata', DESCRIPTION: 'Tata Tata ', LogoPath: 'tata.png', WebsiteUrl: 'https://www.tata.com/', DisplayOrder: '1'}]};
  global.fetch = jest.fn(async () => new global.Response(JSON.stringify(payload), {status: 200, headers: {'Content-Type': 'application/json'}}));
  store.dispatch(setSession({accessToken: 'current-brand-session-token'}));
  const request = store.dispatch(api.endpoints.getBrands.initiate());
  await expect(request.unwrap()).resolves.toEqual(payload);
  const sent = global.fetch.mock.calls[0][0];
  expect(sent.url).toBe(`${BASE_URL}Master/Brand`);
  expect(sent.method).toBe('GET');
  expect(await sent.clone().text()).toBe('');
  expect(sent.headers.get('Authorization')).toBe('Bearer current-brand-session-token');
  request.unsubscribe();
});
