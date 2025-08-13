"use client";

export function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const cookie = `${name}=${encodeURIComponent(
    JSON.stringify(value)
  )};expires=${expires.toUTCString()};path=/`;
  document.cookie = cookie;
}

export function getCookie(name) {
  if (typeof window !== "undefined") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + "=")) {
        return JSON.parse(
          decodeURIComponent(cookie.substring(name.length + 1))
        );
      }
    }
  }
  return null;
}

export function clearCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
}
