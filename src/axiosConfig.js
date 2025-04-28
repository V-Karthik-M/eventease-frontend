// src/axiosConfig.js
import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL || "https://eventease-backend-j1ob.onrender.com/api";

// Setup global axios defaults
axios.defaults.baseURL = backendURL; 
axios.defaults.withCredentials = true; 

export default axios;
