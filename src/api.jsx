import axios from "axios";

// Use your local network IP for Django backend
const API_BASE_URL = "http://192.168.1.100:8000";  

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,  // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add auth token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
