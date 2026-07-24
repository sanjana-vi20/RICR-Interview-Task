import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || `http://${window.location.hostname}:4000`,
  withCredentials: true,
});

export default axiosInstance;
