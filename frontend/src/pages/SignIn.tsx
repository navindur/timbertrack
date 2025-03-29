import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
} from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import Footer from "../components/Footer";
import Navbar from '../components/Navbar';

const SignIn: React.FC = () => {
  const navigate = useNavigate(); // To redirect after login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // Handle errors


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state

    try {
      const response = await axiosInstance.post("/auth/login", { email, password });
      localStorage.setItem("authToken", response.data.token); // Store token
      navigate("/dashboard"); // Redirect after login
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <Container maxWidth="md" sx={{ marginTop: "2rem", marginBottom: "2rem" }}>
        <Grid container spacing={10}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: "500px",
                backgroundImage: "url(/signup.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "8px",
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                padding: "1.5rem",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
                <span style={{ color: "#C24507" }}>Timber</span>
                <span style={{ color: "#1C486F" }}>Track</span>
              </Typography>

              <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", marginBottom: "1rem" }}>
                Log in to your account
              </Typography>

              {error && (
                <Typography color="error" sx={{ marginBottom: "1rem" }}>
                  {error}
                </Typography>
              )}

              <Box component="form" onSubmit={handleLogin} sx={{ width: "100%" }}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      variant="outlined"
                      required
                      size="small"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Password"
                      type="password"
                      variant="outlined"
                      required
                      size="small"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Grid>
                </Grid>

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{
                    marginTop: "1rem",
                    backgroundColor: "#B88E2F",
                    "&:hover": { backgroundColor: "#A03A06" },
                  }}
                >
                  Log In
                </Button>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", width: "100%", marginTop: "1rem", marginBottom: "1rem" }}>
                <Box sx={{ flex: 1, height: "1px", backgroundColor: "#E0E0E0" }} />
                <Typography variant="body1" sx={{ margin: "0 0.5rem", color: "#757575" }}>OR</Typography>
                <Box sx={{ flex: 1, height: "1px", backgroundColor: "#E0E0E0" }} />
              </Box>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                sx={{
                  marginBottom: "1rem",
                  color: "#757575",
                  borderColor: "#E0E0E0",
                  "&:hover": { borderColor: "#C24507", color: "#C24507" },
                }}
              >
                Sign in with Google
              </Button>

              <Typography variant="body1" sx={{ color: "#757575" }}>
                Don't have an account?{" "}
                <Link href="/signup" sx={{ color: "#B88E2F", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </div>
  );
};

export default SignIn;
