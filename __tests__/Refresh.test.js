/* eslint-env jest */
import * as Keychain from 'react-native-keychain';
import {api} from '../src/redux/api';
import {store} from '../src/redux/store';
import {clearSession, restoreSession, setSession} from '../src/redux/authSlice';

jest.mock('react-native-keychain', () => ({getGenericPassword: jest.fn(), setGenericPassword: jest.fn(), resetGenericPassword: jest.fn()}));
const oldSession = {accessToken: 'old-access', refreshToken: 'old-refresh', accessTokenExpiresAt: '2099-01-01T00:00:00Z', refreshTokenExpiresAt: '2099-02-01T00:00:00Z', userId: 5, type: 'customer'};
const rotated = {accessToken: 'new-access', refreshToken: 'new-refresh', accessTokenExpiresAt: '2099-01-02T00:00:00Z', refreshTokenExpiresAt: '2099-02-02T00:00:00Z', userId: 5};
const originalFetch = global.fetch;
const response = (data, status = 200) => new global.Response(JSON.stringify(data), {status, headers: {'Content-Type': 'application/json'}});
const isRefresh = request => request.url.endsWith('/AuthCustomer/refreshtoken');
beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  Keychain.setGenericPassword.mockResolvedValue({service: 'vehicle-customer-session'});
  Keychain.resetGenericPassword.mockResolvedValue(true);
  store.dispatch(setSession(oldSession));
});
afterEach(async () => {
  await clearSession();
  store.dispatch(setSession(null));
  store.dispatch(api.util.resetApiState());
  global.fetch = originalFetch;
  jest.clearAllTimers();
  jest.useRealTimers();
});
test('refreshes on 401, saves rotated tokens and retries with the new access token', async () => {
  global.fetch = jest.fn(async request => {
    if (isRefresh(request)) {
      expect(request.headers.get('Authorization')).toBeNull();
      expect(JSON.parse(await request.clone().text())).toEqual({refreshToken: 'old-refresh'});
      return response({success: true, data: rotated});
    }
    return request.headers.get('Authorization') === 'Bearer new-access' ? response([{id: 1}]) : response({}, 401);
  });
  const request = store.dispatch(api.endpoints.getVehicles.initiate());
  await expect(request.unwrap()).resolves.toEqual([{id: 1}]);
  expect(global.fetch).toHaveBeenCalledTimes(3);
  expect(store.getState().auth.session).toEqual({...oldSession, ...rotated});
  expect(JSON.parse(Keychain.setGenericPassword.mock.calls[0][1]).refreshToken).toBe('new-refresh');
  request.unsubscribe();
});
test('concurrent 401 responses share one refresh request', async () => {
  let finish;
  const pending = new Promise(resolve => {finish = resolve;});
  let started;
  const refreshStarted = new Promise(resolve => {started = resolve;});
  global.fetch = jest.fn(async request => {
    if (isRefresh(request)) {started(); return pending;}
    return request.headers.get('Authorization') === 'Bearer new-access' ? response([]) : response({}, 401);
  });
  const first = store.dispatch(api.endpoints.getVehicles.initiate({page: 1}));
  const second = store.dispatch(api.endpoints.getVehicles.initiate({page: 2}));
  await refreshStarted;
  finish(response({success: true, data: rotated}));
  await expect(first.unwrap()).resolves.toEqual([]);
  await expect(second.unwrap()).resolves.toEqual([]);
  expect(global.fetch.mock.calls.filter(([request]) => isRefresh(request))).toHaveLength(1);
  first.unsubscribe(); second.unsubscribe();
});

test('a newly refreshed token rejected with 401 ends the session without a refresh loop', async () => {
  global.fetch = jest.fn(async request => isRefresh(request) ? response({success: true, data: rotated}) : response({}, 401));
  const request = store.dispatch(api.endpoints.getProfile.initiate());
  await request;
  expect(global.fetch).toHaveBeenCalledTimes(3);
  expect(store.getState().auth.session).toBeNull();
  expect(Keychain.resetGenericPassword).toHaveBeenCalled();
  request.unsubscribe();
});

test.each(['getProfile', 'getUserAddresses'])('%s refreshes the token and retries its protected AuthCustomer endpoint', async endpoint => {
  global.fetch = jest.fn(async request => {
    if (isRefresh(request)) {return response({success: true, data: rotated});}
    return request.headers.get('Authorization') === 'Bearer new-access' ? response({success: true, data: []}) : response({}, 401);
  });
  const request = store.dispatch(api.endpoints[endpoint].initiate());
  await expect(request.unwrap()).resolves.toEqual({success: true, data: []});
  expect(global.fetch).toHaveBeenCalledTimes(3);
  expect(store.getState().auth.session.refreshToken).toBe('new-refresh');
  request.unsubscribe();
});
test.each([
  ['HTTP rejection', () => response({}, 401)],
  ['business rejection', () => response({success: false})],
  ['malformed response', () => response({success: true, data: {}})],
])('clears the session after %s', async (_label, rejected) => {
  global.fetch = jest.fn(async request => isRefresh(request) ? rejected() : response({}, 401));
  const request = store.dispatch(api.endpoints.getVehicles.initiate());
  await request;
  expect(store.getState().auth.session).toBeNull();
  expect(Keychain.resetGenericPassword).toHaveBeenCalled();
  request.unsubscribe();
});
test('temporary refresh failures preserve credentials and do not loop', async () => {
  global.fetch = jest.fn(async request => isRefresh(request) ? response({}, 503) : response({}, 401));
  const request = store.dispatch(api.endpoints.getVehicles.initiate());
  await expect(request.unwrap()).rejects.toMatchObject({status: 503});
  expect(store.getState().auth.session).toEqual(oldSession);
  expect(Keychain.resetGenericPassword).not.toHaveBeenCalled();
  expect(global.fetch).toHaveBeenCalledTimes(2);
  request.unsubscribe();
});
test('does not refresh failed public authentication requests', async () => {
  global.fetch = jest.fn(async () => response({}, 401));
  const request = store.dispatch(api.endpoints.sendOtp.initiate({mobileNo: '9000000000'}));
  await expect(request.unwrap()).rejects.toMatchObject({status: 401});
  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(store.getState().auth.session).toEqual(oldSession);
  request.reset();
});
test('refreshes an expired saved session during app startup and preserves customer type', async () => {
  Keychain.getGenericPassword.mockResolvedValue({password: JSON.stringify({...oldSession, accessTokenExpiresAt: '2000-01-01T00:00:00Z'})});
  global.fetch = jest.fn(async () => response({success: true, data: rotated}));
  const session = await restoreSession(async body => {
    const request = store.dispatch(api.endpoints.refreshToken.initiate(body));
    try {return await request.unwrap();} finally {request.reset();}
  });
  expect(session).toEqual({...oldSession, ...rotated});
  expect(Keychain.setGenericPassword).toHaveBeenCalled();
});
test('does not refresh a saved session with an expired refresh token', async () => {
  Keychain.getGenericPassword.mockResolvedValue({password: JSON.stringify({...oldSession, accessTokenExpiresAt: '2000-01-01T00:00:00Z', refreshTokenExpiresAt: '2000-01-01T00:00:00Z'})});
  const refresh = jest.fn();
  await expect(restoreSession(refresh)).resolves.toBeNull();
  expect(refresh).not.toHaveBeenCalled();
});
test('a refresh finishing after logout cannot restore credentials', async () => {
  let finish;
  let started;
  const refreshStarted = new Promise(resolve => {started = resolve;});
  const pending = new Promise(resolve => {finish = resolve;});
  global.fetch = jest.fn(async request => {
    if (isRefresh(request)) {started(); return pending;}
    return response({}, 401);
  });
  const request = store.dispatch(api.endpoints.getVehicles.initiate());
  await refreshStarted;
  await clearSession();
  store.dispatch(setSession(null));
  finish(response({success: true, data: rotated}));
  await request;
  expect(store.getState().auth.session).toBeNull();
  expect(Keychain.setGenericPassword).not.toHaveBeenCalled();
  request.unsubscribe();
});
