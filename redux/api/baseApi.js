// src/redux/api/baseApi.js
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

// load from .env
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://gencrest.effybiz.com/api";

// 🔹 Base query WITH credentials (for authenticated APIs)
export const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    headers.set('Accept', '*/*');
    headers.set('Content-Type', 'application/json');
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

// 🔹 Base query WITHOUT credentials (for public endpoints like CSRF)
export const publicBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "omit",
});
