import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.1.47:8000",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;
