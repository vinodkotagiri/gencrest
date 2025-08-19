// src/redux/api/auth/authApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../api/baseApi";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    getCsrfToken: builder.query({
      query: () => "/v1/auth/csrf",
    }),
    loginWithPassword: builder.mutation({
      query: (credentials) => ({
        url: "/v1/auth/login/password",
        method: "POST",
        body: credentials,
      }),
    }),
    requestOtp: builder.mutation({
      query: (identifier) => ({
        url: "/v1/auth/request-otp",
        method: "POST",
        body: identifier,
      }),
    }),
    loginWithOtp: builder.mutation({
      query: (data) => ({
        url: "/v1/auth/login/otp",
        method: "POST",
        body: data,
      }),
    }),
    verifyAccount: builder.mutation({
      query: (data) => ({
        url: "/v1/auth/verify-account",
        method: "POST",
        body: data,
      }),
    }),
    getProfile: builder.query({
      query: () => "/v1/auth/profile",
    }),
    mfaGenerate: builder.mutation({
      query: () => ({
        url: "/v1/auth/mfa/generate",
        method: "POST",
      }),
    }),
    mfaEnable: builder.mutation({
      query: (data) => ({
        url: "/v1/auth/mfa/enable",
        method: "POST",
        body: data,
      }),
    }),
    mfaVerify: builder.mutation({
      query: (data) => ({
        url: "/v1/auth/mfa/verify",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetCsrfTokenQuery,
  useLazyGetCsrfTokenQuery,
  useLoginWithPasswordMutation,
  useRequestOtpMutation,
  useLoginWithOtpMutation,
  useVerifyAccountMutation,
  useGetProfileQuery,
  useMfaGenerateMutation,
  useMfaEnableMutation,
  useMfaVerifyMutation,
} = authApi;
