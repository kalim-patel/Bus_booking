import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/** Axios instance for BUS TRACK API */
export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bus_track_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message || err.message || "Something went wrong";
    return Promise.reject(new Error(msg));
  }
);
