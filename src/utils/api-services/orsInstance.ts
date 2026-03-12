import axios from "axios";

const orsInstance = axios.create({
  baseURL: "https://api.openrouteservice.org",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach ORS API key automatically
orsInstance.interceptors.request.use((config) => {
  const apiKey = import.meta.env.VITE_ORS_API_KEY;

  if (!apiKey) {
    console.warn("ORS API key is missing.");
  }

  config.headers.Authorization = apiKey; // ORS expects API key directly

  return config;
});

orsInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("ORS Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default orsInstance;
