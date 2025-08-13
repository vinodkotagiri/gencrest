import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Avatar,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { useLoginWithPasswordMutation } from "../../redux/api/userApi";

const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .matches(/^(?=.*[a-z])/, "At least one lowercase letter")
    .matches(/^(?=.*[A-Z])/, "At least one uppercase letter")
    .matches(/^(?=.*[0-9])/, "At least one number")
    .matches(/^(?=.*[!@#$%^&*])/, "At least one special character")
    .min(8, "At least 8 characters"),
});

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const [loginWithPassword, { isLoading }] = useLoginWithPasswordMutation();

  const passwordRules = [
    { test: /.{8,}/, label: "At least 8 characters" },
    { test: /[A-Z]/, label: "At least one uppercase letter" },
    { test: /[a-z]/, label: "At least one lowercase letter" },
    { test: /[0-9]/, label: "At least one number" },
    { test: /[!@#$%^&*]/, label: "At least one special character" },
  ];

  const getPasswordStatus = (password) =>
    passwordRules.map((rule) => ({
      label: rule.label,
      passed: rule.test.test(password),
    }));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await schema.validate(formData, { abortEarly: false });
      setErrors({});
      const response = await loginWithPassword({
        email: formData.email,
        password: formData.password,
      }).unwrap();
      if (response?.token_detail?.token) {
        Cookies.set("authToken", JSON.stringify(response), { expires: 1 });
        alert("Login successful!");
      } else {
        alert("Login failed: No token received.");
      }
    } catch (err) {
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

  const passwordStatus = getPasswordStatus(formData.password);
  const passwordValid = passwordStatus.every((rule) => rule.passed);

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
          sx={{
            width: 80,
            height: 80,
            margin: "0 auto",
          }}
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
            error={
              !!errors.password ||
              (!passwordValid && formData.password.length > 0)
            }
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

          {formData.password.length > 0 && !passwordValid && (
            <List dense sx={{ textAlign: "left", mt: 1 }}>
              {passwordStatus.map((rule, idx) => (
                <ListItem
                  key={idx}
                  sx={{ color: rule.passed ? "green" : "red" }}
                >
                  <ListItemText primary={rule.label} />
                </ListItem>
              ))}
            </List>
          )}

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
                opacity: 0.7, // slightly faded but still visible
              },
              textTransform: "none",
              fontSize: "16px",
              py: 1.5,
              borderRadius: "8px",
            }}
            disabled={!passwordValid || isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Box>
    </Box>
  );
}
