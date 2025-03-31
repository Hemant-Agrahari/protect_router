import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query';
import { RootState } from './store';
import { removeUser } from './user/userReducer';

// Define base query with authorization header
export const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).user?.user?.token;

    if (token) {
      headers.set('token', `${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, store, extraOptions) => {
  let result = await baseQuery(args, store, extraOptions);
  const authState = (store.getState() as RootState).user.user;

  if (result.error && result.error.status === 404) {
    if (!authState?.token) return result;

    // Update token to use refresh token
    // store.dispatch(adjustUsedToken(authState.refreshToken as string));

    // Try to refresh the token
    // const refreshResult = await baseQuery(
    //   '/refresh-token',
    //   store,
    //   extraOptions,
    // );

    // if (refreshResult.data) {
    // Store the new tokens
    // store.dispatch(
    //   authTokenChange({
    //     accessToken: (refreshResult.data as any).accessToken,
    //     refreshToken: authState.refreshToken as string,
    //   }),
    // );
    // Retry the original request
    // result = await baseQuery(args, store, extraOptions);
    // } else {
    store.dispatch(removeUser());
    // }
  }
  return result;
};
