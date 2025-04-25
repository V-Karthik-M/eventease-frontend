// src/axiosConfig.js
import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL || "https://eventease-backend.onrender.com"; // ← your Render backend URL
axios.defaults.baseURL = backendURL;
axios.defaults.withCredentials = true;

export default axios;
