/** @format */

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Link,
  Grid,
  Avatar,
  IconButton,
  InputAdornment,
  useTheme,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Visibility, VisibilityOff, BusinessCenter } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useSnackbar } from "notistack";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await login(email, password);
      if (response) {
        enqueueSnackbar("Login successful!", { variant: "success" });

        // Get user role from response
        const userRole = response.data.data.role;
        console.log("User role:", userRole);

        // Navigate based on user role
        switch (userRole) {
          case "importer":
            navigate("/importer/dashboard");
            break;
          case "exporter":
            navigate("/exporter/dashboard");
            break;
          case "admin":
            navigate("/admin/dashboard");
            break;
          default:
            // If role is not recognized, redirect to home
            navigate("/");
            enqueueSnackbar("Unknown user role. Please contact support.", {
              variant: "warning",
            });
        }
      } else {
        setError("Invalid email or password");
        enqueueSnackbar("Login failed", { variant: "error" });
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
      enqueueSnackbar("Login failed", { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "row",
        bgcolor: "background.default",
      }}
    >
      {/* Left side - Hero image */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage:
            "url(https://images.pexels.com/photos/92904/pexels-photo-92904.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          color: "white",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(13, 71, 161, 0.7)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 6,
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{ mb: 3, fontWeight: 700 }}
          >
            Ceylon Trade
          </Typography>
          <Typography
            variant="h5"
            sx={{ mb: 4, maxWidth: "80%", textAlign: "center" }}
          >
            Import & Export Management Platform for Sri Lankan Businesses
          </Typography>
          <Box sx={{ maxWidth: "80%" }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Connect with international markets, streamline your trade
              operations, and grow your business globally.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Right side - Login form */}
      <Box
        sx={{
          flex: { xs: 1, md: 0.6 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          p: { xs: 2, sm: 4 },
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            className="fade-in"
          >
            <Avatar
              sx={{ m: 1, bgcolor: "primary.main", width: 60, height: 60 }}
            >
              <BusinessCenter fontSize="large" />
            </Avatar>
            <Typography
              component="h1"
              variant="h5"
              sx={{ mb: 3, fontWeight: 600 }}
            >
              Log in to your account
            </Typography>

            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: "100%", mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isSubmitting}
                sx={{
                  py: 1.5,
                  mb: 3,
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                {isSubmitting ? "Logging in..." : "Log In"}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link component="button" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link component={RouterLink} to="/register" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mt: 4, width: "100%" }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 2, textAlign: "center", color: "text.secondary" }}
              >
                Demo Credentials
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Importer: importer@demo.com / password123
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Exporter: exporter@demo.com / password123
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;
