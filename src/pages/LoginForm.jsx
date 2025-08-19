import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { useGetCsrfTokenQuery, useLoginWithPasswordMutation } from "../../redux/api/authApi";


const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  // API hooks
  const [loginWithPassword, { isLoading }] = useLoginWithPasswordMutation();
  const { refetch: fetchCsrf } = useGetCsrfTokenQuery(undefined, { skip: true });

  // Fetch CSRF token on mount
  useEffect(() => {
    const getToken = async () => {
      try {
        const res = await fetchCsrf();
        if (res?.data?.csrfToken) {
          Cookies.set("X-CSRF-TOKEN", res.data.csrfToken, { expires: 1 });
        }
      } catch (error) {
        console.error("Failed to fetch CSRF token", error);
      }
    };
    getToken();
  }, [fetchCsrf]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await schema.validate(formData, { abortEarly: false });
      setErrors({});

      // API expects "identifier" instead of "email"
      const response = await loginWithPassword({
        identifier: formData.email,
        password: formData.password,
      }).unwrap();
console.log("response 123", response);

      if (response?.token_detail?.token) {
        Cookies.set("authToken", JSON.stringify(response), { expires: 1 });
        alert("Login successful!");
      } else {
        alert("Login failed: No token received.");
      }
    } catch (err) {
      console.log("Errorr", err);
      
      if (err?.inner) {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      } else if (err?.data?.message) {
        alert(`Login failed: ${err.data.message}`);
      } else {
        alert("An error occurred during login.");
      }
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#fff"
      px={2}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          p: isSmallScreen ? 3 : 5,
          textAlign: "center",
          backgroundColor: "#fff",
        }}
      >
        <Avatar
          src="/images/gen-icon.png"
          alt="Gencrest Logo"
          sx={{ width: 80, height: 80, margin: "0 auto" }}
        />

        <Typography variant="h6" mt={3} fontWeight="bold" color="#000">
          Welcome to Gencrest
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Login to Your Account
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            placeholder="Email"
            variant="outlined"
            margin="normal"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            fullWidth
            placeholder="Password"
            variant="outlined"
            margin="normal"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Typography
            variant="body2"
            align="right"
            color="#9e9e9e"
            sx={{ cursor: "pointer", mt: 1 }}
          >
            Forgot password ?
          </Typography>

          <Button
            type="submit"
            fullWidth
            sx={{
              mt: 3,
              backgroundColor: "#c2185b",
              color: "#fff",
              "&:hover": { backgroundColor: "#ad1457" },
              "&.Mui-disabled": {
                backgroundColor: "#c2185b",
                color: "#fff",
                opacity: 0.7,
              },
              textTransform: "none",
              fontSize: "16px",
              py: 1.5,
              borderRadius: "8px",
            }}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Box>
    </Box>
  );
}
