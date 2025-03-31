import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../middleware';
import { loginRequest, signUpResponse, signUpRequest } from '@/types/user';
import { routes } from '@/utils/routes';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // Get user data
    signIn: builder.mutation<loginRequest, signUpRequest>({
      query: (credentials) => ({
        url: routes.signIn,
        method: 'POST',
        body: credentials,
      }),
    }),
    signUp: builder.mutation<signUpResponse, signUpRequest>({
      query: (credentials) => ({
        url: routes.signUp,
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const { useSignInMutation, useSignUpMutation } = userApi;
