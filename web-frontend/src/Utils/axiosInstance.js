import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = "http://192.168.1.47:8000/";
// const API_BASE_URL = "https://pathfinder-d2sz.onrender.com/";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
