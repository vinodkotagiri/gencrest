import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL, // ✅ Fixed
    prepareHeaders: (headers) => {
      // Optional CSRF token
      const csrfToken = Cookies.get("X-CSRF-TOKEN");
      if (csrfToken) {
        headers.set("X-CSRF-TOKEN", csrfToken);
      }

      // Optional Auth token
      const authToken = Cookies.get("authToken");
      if (authToken) {
        try {
          const parsed = JSON.parse(authToken);
          if (parsed?.token_detail?.token) {
            headers.set("Authorization", `Bearer ${parsed.token_detail.token}`);
          }
        } catch (e) {
          console.warn("Invalid auth token format");
        }
      }

      return headers;
    },
  }),
  tagTypes: ["User"],

  endpoints: (builder) => ({
    // Login API
    loginWithPassword: builder.mutation({
      query: (credentials) => ({
        url: "/api/v1/auth/login/password",
        method: "POST",
        body: credentials,
      }),
    }),

    // Example other APIs
    searchUser: builder.mutation({
      query: (requestData) => ({
        url: "/searchuser",
        method: "POST",
        body: requestData,
      }),
      invalidatesTags: ["User"],
    }),

    validateUser: builder.mutation({
      query: (requestData) => ({
        url: "/validateuser",
        method: "POST",
        body: requestData,
      }),
      invalidatesTags: ["User"],
    }),

    getAllUsers: builder.query({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useLoginWithPasswordMutation,
  useSearchUserMutation,
  useValidateUserMutation,
  useGetAllUsersQuery,
} = userApi;
