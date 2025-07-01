//custom order odering page
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createCustomOrder } from "../services/customOrderService";
import { Button, TextField, Box, Typography, Paper, CircularProgress } from "@mui/material";
import FileUpload from "../components/FileUpload"; //created component
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CustomOrderPage: React.FC = () => {
  const { user, customer } = useAuth();
  const [details, setDetails] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customer) {
      setError("You must be logged in as a customer to place a custom order");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
     //call service to create custom order 
      await createCustomOrder(customer.customer_id, details, imageFile || undefined);
      setSuccessMessage("Your custom order has been submitted successfully!");
      setDetails("");
      setImageFile(null);
    } catch (err) {
      setError("Failed to submit custom order. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <Navbar />
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Request a Custom Order
        </Typography>
        
        {successMessage && (
          <Typography color="success.main" sx={{ mb: 2 }}>
            {successMessage}
          </Typography>
        )}
        
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Order Details"
            multiline
            rows={6}
            fullWidth
            variant="outlined"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            required
            sx={{ mb: 3 }}
            placeholder="Describe what you want in detail (materials, size, color, etc.)"
          />
          
          <FileUpload
            label="Upload Reference Image (Optional)"
            onFileChange={setImageFile}
            accept="image/*"
          />
          
          {imageFile && (
            <Box mt={2}>
              <Typography variant="body2">
                Selected file: {imageFile.name}
              </Typography>
            </Box>
          )}
          
          <Box mt={4}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting || !details}
              fullWidth
              size="large"
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Submit Request"
              )}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
    <Footer />
    </>
  );
};

export default CustomOrderPage;