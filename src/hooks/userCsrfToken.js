// src/hooks/useCsrfToken.js
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useLazyGetCsrfTokenQuery } from "../../redux/api/authApi";

export default function useCsrfToken() {
  const [fetchCsrf] = useLazyGetCsrfTokenQuery();

  useEffect(() => {
    const existingToken = Cookies.get("X-CSRF-TOKEN");
    if (!existingToken) {
      const getToken = async () => {
        try {
          const res = await fetchCsrf().unwrap();
          if (res?.data?.csrfToken) {
            Cookies.set("X-CSRF-TOKEN", res.data.csrfToken, { expires: 1 });
            console.log("CSRF token saved:", res.data.csrfToken);
          }
        } catch (error) {
          console.error("Failed to fetch CSRF token", error);
        }
      };
      getToken();
    }
  }, [fetchCsrf]);
}
