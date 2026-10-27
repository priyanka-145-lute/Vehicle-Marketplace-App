import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {canRefreshSession, clearSession, isRefreshRejected, renewSession, setSession} from './authSlice';

export const BASE_URL = 'https://autoadmin.growlinkstech.in/api/';

const REFRESH_URL = 'AuthCustomer/refreshtoken';
const isPublicRequest = args => (typeof args === 'string' ? args : args.url).startsWith('AuthCustomer/');
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, {getState, arg}) => {
    const token = getState().auth?.session?.accessToken;
    if (token && !isPublicRequest(arg)) {headers.set('Authorization', `Bearer ${token}`);}
    return headers;
  },
});
let refreshing;

const baseQueryWithRefresh = async (args, queryApi, extraOptions) => {
  const session = queryApi.getState().auth?.session;
  const result = await baseQuery(args, queryApi, extraOptions);
  if (result.error?.status !== 401 || isPublicRequest(args) || !session) {return result;}
  // A concurrent request may already have rotated this session's tokens.
  const current = queryApi.getState().auth?.session;
  if (current !== session) {
    return current?.userId === session.userId && current ? baseQuery(args, queryApi, extraOptions) : result;
  }
  try {
    if (!canRefreshSession(session)) {throw Object.assign(new Error('Session expired'), {status: 401});}
    if (!refreshing || refreshing.session !== session) {
      const pending = renewSession(session, async body => {
        const response = await baseQuery({url: REFRESH_URL, method: 'POST', body}, queryApi, extraOptions);
        if (response.error) {throw response.error;}
        return response.data;
      }, () => queryApi.getState().auth?.session === session)
        .then(next => {if (next) {queryApi.dispatch(setSession(next));} return next;})
        .finally(() => {if (refreshing?.promise === pending) {refreshing = null;}});
      refreshing = {session, promise: pending};
    }
    const next = await refreshing.promise;
    return next ? baseQuery(args, queryApi, extraOptions) : result;
  } catch (error) {
    if (isRefreshRejected(error) && queryApi.getState().auth?.session === session) {
      try {await clearSession();} catch { /* Keep rejected credentials out of the active session. */ }
      if (queryApi.getState().auth?.session === session) {
        queryApi.dispatch(setSession(null));
        queryApi.dispatch(api.util.resetApiState());
      }
    }
    return {error: {status: error.status || 'CUSTOM_ERROR', error: error.message || 'Could not refresh session. Please try again.'}};
  }
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithRefresh,
  endpoints: builder => ({
    getCountries: builder.query({
      query: () => 'Master/Country',
    }),
    getStates: builder.query({
      query: countryId => ({url: 'Master/State', method: 'POST', params: {CountryID: countryId}}),
    }),
    getCities: builder.query({
      query: stateId => ({url: 'Master/City', method: 'POST', params: {stateid: stateId}}),
    }),
    getAreas: builder.query({
      query: cityId => ({url: 'Master/AreaName', method: 'POST', params: {cityid: cityId}}),
    }),
    refreshToken: builder.mutation({
      query: body => ({url: REFRESH_URL, method: 'POST', body}),
    }),
    sendOtp: builder.mutation({
      query: body => ({url: 'AuthCustomer/SendOtp', method: 'POST', body}),
    }),
    verifyOtp: builder.mutation({
      query: body => ({url: 'AuthCustomer/verifyotp', method: 'POST', body}),
    }),
    registerUser: builder.mutation({
      query: body => ({url: 'AuthCustomer/RegisterUser', method: 'POST', body}),
    }),
    getVehicles: builder.query({
      query: params => ({url: 'vehicles', params}),
    }),
  }),
});

export const {useGetVehiclesQuery, useRegisterUserMutation, useSendOtpMutation, useVerifyOtpMutation, useRefreshTokenMutation} = api;
export const {useGetCountriesQuery, useGetStatesQuery, useGetCitiesQuery, useGetAreasQuery} = api;
