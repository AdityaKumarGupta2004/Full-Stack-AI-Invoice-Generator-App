import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ Request Interceptor (async/await version)
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const accessToken = await localStorage.getItem("token");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    } catch (error) {
      console.error("Error in request interceptor:", error);
      throw error;
    }
  },
  async (error) => {
    console.error("Request configuration error:", error);
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor (async/await version)
axiosInstance.interceptors.response.use(
  async (response) => {
    try {
      return await response;
    } catch (error) {
      console.error("Error processing response:", error);
      throw error;
    }
  },
  async (error) => {
    try {
      if (error.response) {
        if (error.response.status === 500) {
          console.error("Server error. Please try again later.");
        }
      } else if (error.code === "ECONNABORTED") {
        console.error("Request timeout. Please try again.");
      }
    } catch (err) {
      console.error("Response error handling failed:", err);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
