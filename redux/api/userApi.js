// src/redux/api/userApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const BASE_URL = "https://gencrest.effybiz.com/api";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
    prepareHeaders: (headers, { endpoint }) => {
      // CSRF token
      const csrfToken = Cookies.get("X-CSRF-TOKEN");
      if (csrfToken) {
        headers.set("X-CSRF-TOKEN", csrfToken);
      }

      // Auth token
      const authToken = Cookies.get("authToken");
      if (authToken) {
        try {
          const parsed = JSON.parse(authToken);
          if (parsed?.token_detail?.token) {
            headers.set("Authorization", `Bearer ${parsed.token_detail.token}`);
          }
        } catch {
          console.warn("Invalid auth token format");
        }
      }
      return headers;
    },
  }),
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
    getCurrentUser: builder.query({
      query: () => "/v1/user/me",
    }),
  }),
});

export const {
  useGetCsrfTokenQuery,
  useLazyGetCsrfTokenQuery,
  useLoginWithPasswordMutation,
  useGetCurrentUserQuery,
} = userApi;
