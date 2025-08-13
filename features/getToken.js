import Cookies from "js-cookie";
import cuid from "cuid";

export function getHeaders() {
  const token = Cookies.get("authToken");
  const requestId = cuid();

  if (token) {
    try {
      const parsedToken = JSON.parse(token);
      const authToken = parsedToken?.token_detail?.token;

      if (authToken) {
        return {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        };
      }
    } catch (error) {
      console.error("Error parsing authToken:", error);
    }
  } else {
    return {
      "Content-Type": "application/json",
      requestId: requestId,
    };
  }

  return {};
}
