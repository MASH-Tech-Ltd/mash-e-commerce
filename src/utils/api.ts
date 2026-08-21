import axios from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Removed interceptors as the storefront is a public website and does not require accessToken storage.

export default api;
