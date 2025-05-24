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
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Visibility,
  VisibilityOff,
  AppRegistration,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useSnackbar } from "notistack";
import { RegisterData } from "../../services/authService";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    gender: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
    company: "",
    role: "importer",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fname.trim()) newErrors.fname = "First name is required";
    if (!formData.lname.trim()) newErrors.lname = "Last name is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.addressLine1.trim())
      newErrors.addressLine1 = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.contact.trim())
      newErrors.contact = "Contact number is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.company.trim())
      newErrors.company = "Company name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const registerData: RegisterData = {
        fname: formData.fname,
        lname: formData.lname,
        gender: formData.gender,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        email: formData.email,
        contact: formData.contact,
        password: formData.password,
        role: formData.role,
      };
      const res = await register(registerData);
      if (res.status === 201) {
        enqueueSnackbar("Registration successful! Please log in.", {
          variant: "success",
        });
        navigate("/login");
      } else {
        enqueueSnackbar(res.data.message, {
          variant: "error",
        });
      }
    } catch (error: any) {
      enqueueSnackbar("Registration failed. Please try again.", {
        variant: "error",
      });
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
      {/* Left side - Hero image (hidden on small screens) */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage:
            "url(https://images.pexels.com/photos/7096339/pexels-photo-7096339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)",
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
            Join Ceylon Trade
          </Typography>
          <Typography
            variant="h5"
            sx={{ mb: 4, maxWidth: "80%", textAlign: "center" }}
          >
            Create an account to start trading globally
          </Typography>
          <Box sx={{ maxWidth: "80%" }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Register today to access our platform's full features and connect
              with businesses worldwide.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Right side - Registration form */}
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
              <AppRegistration fontSize="large" />
            </Avatar>
            <Typography
              component="h1"
              variant="h5"
              sx={{ mb: 3, fontWeight: 600 }}
            >
              Create Your Account
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: "100%", mt: 1 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="fname"
                    label="First Name"
                    name="fname"
                    value={formData.fname}
                    onChange={handleChange}
                    error={!!errors.fname}
                    helperText={errors.fname}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lname"
                    label="Last Name"
                    name="lname"
                    value={formData.lname}
                    onChange={handleChange}
                    error={!!errors.lname}
                    helperText={errors.lname}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel id="gender-label">Gender</InputLabel>
                    <Select
                      labelId="gender-label"
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      label="Gender"
                      onChange={handleSelectChange}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="addressLine1"
                    label="Address Line 1"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    error={!!errors.addressLine1}
                    helperText={errors.addressLine1}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="addressLine2"
                    label="Address Line 2"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="city"
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    error={!!errors.city}
                    helperText={errors.city}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="state"
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    error={!!errors.state}
                    helperText={errors.state}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="zipCode"
                    label="ZIP Code"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    error={!!errors.zipCode}
                    helperText={errors.zipCode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="country"
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="contact"
                    label="Contact Number"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    error={!!errors.contact}
                    helperText={errors.contact}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
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
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="company"
                    label="Company Name"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    error={!!errors.company}
                    helperText={errors.company}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel id="role-label">Account Type</InputLabel>
                    <Select
                      labelId="role-label"
                      id="role"
                      name="role"
                      value={formData.role}
                      label="Account Type"
                      onChange={handleSelectChange}
                    >
                      <MenuItem value="importer">Importer</MenuItem>
                      <MenuItem value="exporter">Exporter</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isSubmitting}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link component={RouterLink} to="/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Register;
