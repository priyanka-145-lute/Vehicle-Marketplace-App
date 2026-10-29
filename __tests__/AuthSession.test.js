/* eslint-env jest */
import * as Keychain from 'react-native-keychain';
import {canRefreshSession, clearSession, isValidSession, restoreSession, saveSession} from '../src/redux/authSlice';

jest.mock('react-native-keychain', () => ({getGenericPassword: jest.fn(), setGenericPassword: jest.fn(), resetGenericPassword: jest.fn()}));
const session = {accessToken: 'test-access', refreshToken: 'test-refresh', accessTokenExpiresAt: '2099-01-01T00:00:00Z'};
beforeEach(() => {
  jest.clearAllMocks();
  Keychain.setGenericPassword.mockResolvedValue({service: 'vehicle-customer-session'});
  Keychain.resetGenericPassword.mockResolvedValue(true);
});
test('saves and restores credentials using secure storage and clears them on logout', async () => {
  await saveSession(session);
  expect(Keychain.setGenericPassword).toHaveBeenCalledWith('customer', JSON.stringify(session), {service: 'vehicle-customer-session'});
  Keychain.getGenericPassword.mockResolvedValue({password: JSON.stringify(session)});
  await expect(restoreSession()).resolves.toEqual(session);
  await clearSession();
  expect(Keychain.resetGenericPassword).toHaveBeenCalledWith({service: 'vehicle-customer-session'});
});
test.each(['broken json', JSON.stringify({...session, accessTokenExpiresAt: '2000-01-01T00:00:00Z'}), '{}'])('does not restore corrupt or expired credentials', async password => {
  Keychain.getGenericPassword.mockResolvedValue({password});
  await expect(restoreSession()).resolves.toBeNull();
  expect(Keychain.resetGenericPassword).toHaveBeenCalled();
});
test('rejects an invalid session and reports storage failure', async () => {
  await expect(saveSession({})).rejects.toThrow();
  expect(Keychain.setGenericPassword).not.toHaveBeenCalled();
  Keychain.setGenericPassword.mockResolvedValue(false);
  await expect(saveSession(session)).rejects.toThrow('Could not save login');
});
test('accepts the API timestamp precision', async () => {
  const precise = {...session, accessTokenExpiresAt: '2099-01-01T00:00:00.3953285'};
  await expect(saveSession(precise)).resolves.toBe(true);
});

test('timezone-free API dates defer expiry to the server instead of device local time', () => {
  const ambiguous = {...session, accessTokenExpiresAt: '2000-01-01T00:00:00.3953285', refreshTokenExpiresAt: '2000-01-08T00:00:00.3953285'};
  expect(isValidSession(ambiguous)).toBe(true);
  expect(canRefreshSession(ambiguous)).toBe(true);
  expect(isValidSession({...ambiguous, accessTokenExpiresAt: 'invalid'})).toBe(false);
  expect(canRefreshSession({...ambiguous, refreshTokenExpiresAt: 'invalid'})).toBe(false);
  expect(isValidSession({...ambiguous, accessTokenExpiresAt: '2000-01-01T00:00:00Z'})).toBe(false);
  expect(canRefreshSession({...ambiguous, refreshTokenExpiresAt: '2000-01-01T00:00:00+05:30'})).toBe(false);
});
