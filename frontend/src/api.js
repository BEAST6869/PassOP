import axios from 'axios';

const api = axios.create({
  // Use your backend's URL. For development, it's likely localhost.
  // In production, this will be your deployed API's URL.
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true, // This is CRUCIAL for sending the JWT cookie
});

export default api;