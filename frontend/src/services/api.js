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
    if (!err.response) {
      return Promise.reject(new Error("Network error. Check your connection and try again."));
    }
    const status = err.response.status;
    const msg = err.response.data?.message;
    if (status >= 500) {
      return Promise.reject(new Error(msg || "Server error. Please try again later."));
    }
    if (status === 401) {
      return Promise.reject(new Error(msg || "Session expired. Please sign in again."));
    }
    if (status === 403) {
      return Promise.reject(new Error(msg || "You do not have permission for this action."));
    }
    if (status === 404) {
      return Promise.reject(new Error(msg || "The requested resource was not found."));
    }
    return Promise.reject(new Error(msg || err.message || "Something went wrong"));
  }
);
