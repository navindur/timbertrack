import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // Update this if your backend runs on a different port

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
