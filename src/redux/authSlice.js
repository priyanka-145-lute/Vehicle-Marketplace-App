import {createSlice} from '@reduxjs/toolkit';
import * as Keychain from 'react-native-keychain';

const authSlice = createSlice({
  name: 'auth',
  initialState: {session: null},
  reducers: {
    setSession: (state, action) => {state.session = action.payload;},
  },
});

export const {setSession} = authSlice.actions;
export default authSlice.reducer;

const options = {service: 'vehicle-customer-session'};
let credentialVersion = 0;
let storageWrite = Promise.resolve();
const writeCredentials = task => {
  const result = storageWrite.then(task);
  storageWrite = result.catch(() => {});
  return result;
};
const expiresInFuture = value => typeof value === 'string' &&
  Date.parse(value.replace(/(\.\d{3})\d+/, '$1')) > Date.now();

export const isValidSession = session => Boolean(
  session && typeof session.accessToken === 'string' && session.accessToken.trim() &&
  typeof session.refreshToken === 'string' && session.refreshToken.trim() &&
  expiresInFuture(session.accessTokenExpiresAt),
);

export const canRefreshSession = session => Boolean(
  session && typeof session.refreshToken === 'string' && session.refreshToken.trim() &&
  (!session.refreshTokenExpiresAt || expiresInFuture(session.refreshTokenExpiresAt)),
);
export const isRefreshRejected = error => [400, 401, 403].includes(error?.status);

export const renewSession = async (session, refresh, isCurrent = () => true) => {
  const version = credentialVersion;
  const response = await refresh({refreshToken: session.refreshToken});
  if (version !== credentialVersion || !isCurrent()) {return null;}
  const next = {...session, ...response?.data};
  if (response?.success !== true || !isValidSession(response.data)) {
    throw Object.assign(new Error('Your session has expired. Please sign in again.'), {status: 401});
  }
  const saved = await saveSession(next, () => version === credentialVersion && isCurrent());
  return saved && version === credentialVersion && isCurrent() ? next : null;
};

export const restoreSession = async refresh => {
  const credentials = await Keychain.getGenericPassword(options);
  if (!credentials) {return null;}
  let session;
  try {session = JSON.parse(credentials.password);} catch {session = null;}
  if (isValidSession(session)) {return session;}
  if (refresh && canRefreshSession(session)) {
    try {return await renewSession(session, refresh);} catch (error) {
      if (!isRefreshRejected(error)) {throw error;}
    }
  }
  await clearSession();
  return null;
};

export const saveSession = async (session, isCurrent) => {
  if (!isValidSession(session)) {throw new Error('Invalid login session. Please try again.');}
  if (!isCurrent) {credentialVersion++; isCurrent = () => true;}
  const version = credentialVersion;
  return writeCredentials(async () => {
    if (version !== credentialVersion || !isCurrent()) {return false;}
    const saved = await Keychain.setGenericPassword('customer', JSON.stringify(session), options);
    if (!saved) {throw new Error('Could not save login. Please try again.');}
    return true;
  });
};

export const clearSession = () => {
  credentialVersion++;
  return writeCredentials(() => Keychain.resetGenericPassword(options));
};
