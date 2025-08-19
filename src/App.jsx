import './App.css';
import Pages from "@/pages/index.jsx";
import { Toaster } from "@/components/ui/toaster";
import useCsrfToken from "../src/hooks/userCsrfToken";

function App() {
  // will auto-fetch CSRF token if missing
  useCsrfToken();

  return (
    <>
      <Pages />
      <Toaster />
    </>
  );
}

export default App;
