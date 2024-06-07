// src/utils/axiosConfig.js

import axios from "axios";
import { ip } from "../services";

// Create an instance of axios
const axiosInstance = axios.create({
  baseURL: `${ip}`, // Replace with your API base URL
});

// Add a request interceptor to include the token in every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("usertoken"); // Get the token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
