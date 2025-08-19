// src/redux/api/baseApi.js
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const BASE_URL = "https://gencrest.effybiz.com/api";

export const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
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
});
