// src/axiosConfig.js
import axios from "axios";

// ✅ Only backend domain here (no /api manually)
// ✅ .env should have: VITE_BACKEND_URL=https://eventease-backend-j1ob.onrender.com/api
const backendURL = import.meta.env.VITE_BACKEND_URL || "https://eventease-backend-j1ob.onrender.com/api";

// Setup global axios defaults
axios.defaults.baseURL = backendURL; // ✅ So that every axios request automatically hits the correct backend
axios.defaults.withCredentials = true; // ✅ Allow cookies and authentication headers

export default axios;
