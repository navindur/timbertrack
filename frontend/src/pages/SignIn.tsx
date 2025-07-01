//signin page for all users
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
  Alert,
  CircularProgress
} from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import Footer from "../components/Footer";
import Navbar from '../components/Navbar';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
  
    try {
      const response = await axiosInstance.post("/auth/login", { email, password });
      //store auth token and user info in localStorage
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      const userRole = response.data.user.role;
      if (userRole === 'shopowner') {
        navigate('/dashboard');  
      } else {
        navigate('/');         
      }
      
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
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
                <Alert severity="error" sx={{ marginBottom: "1rem", width: '100%' }}>
                  {error}
                </Alert>
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
                      onChange={(e) => setEmail(e.target.value.toLowerCase())} 
  inputProps={{
    style: { textTransform: 'lowercase' } 
  }}
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
                  disabled={loading}
                  sx={{
                    marginTop: "1rem",
                    backgroundColor: "#B88E2F",
                    "&:hover": { backgroundColor: "#A03A06" },
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
                </Button>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", width: "100%", marginTop: "1rem", marginBottom: "1rem" }}>
                <Box sx={{ flex: 1, height: "1px", backgroundColor: "#E0E0E0" }} />
                <Typography variant="body1" sx={{ margin: "0 0.5rem", color: "#757575" }}>OR</Typography>
                <Box sx={{ flex: 1, height: "1px", backgroundColor: "#E0E0E0" }} />
              </Box>

              
              <Typography variant="body1" sx={{ color: "#757575" }}>
                Don't have an account?{" "}
                <Link href="/signup" sx={{ color: "#B88E2F", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                  Sign Up
                </Link>
              </Typography>
              <Link href="/forgot-password" sx={{ color: "#B88E2F", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                  Forget Password ?
                </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </div>
  );
};

export default SignIn;