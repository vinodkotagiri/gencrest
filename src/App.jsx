// src/App.jsx
import './App.css';
import Pages from "@/pages/index.jsx";
import { Toaster } from "@/components/ui/toaster";
import Cookies from "js-cookie";
import { useLazyGetCsrfTokenQuery } from "../redux/api/userApi";
import { useEffect } from "react";

function App() {
  // useLazy... returns a trigger function
  const [fetchCsrf] = useLazyGetCsrfTokenQuery();

  useEffect(() => {
    const existingToken = Cookies.get("X-CSRF-TOKEN");
    if (!existingToken) {
      const getToken = async () => {
        try {
          const res = await fetchCsrf().unwrap(); // unwrap gets plain response
          if (res?.data?.csrfToken) {
            Cookies.set("X-CSRF-TOKEN", res.data.csrfToken, { expires: 1 });
            console.log("CSRF token saved to cookies:", res.data.csrfToken);
          }
        } catch (error) {
          console.error("Failed to fetch CSRF token", error);
        }
      };
      getToken();
    }
  }, [fetchCsrf]);

  return (
    <>
      <Pages />
      <Toaster />
    </>
  );
}

export default App;
