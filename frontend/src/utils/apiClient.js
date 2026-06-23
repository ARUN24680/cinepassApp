import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Configure Axios instance for global API queries.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor:
 * Automatically appends the user's JWT Bearer token if it exists in localStorage.
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor:
 * Formats success structures and extracts detailed backend PostgreSQL/Express errors.
 */
apiClient.interceptors.response.use(
  (response) => {
    return response.data; // Return the inner { status, data } payload directly
  },
  (error) => {
    // Extract Postgres/Express message from the response object
    const serverMessage = error.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(serverMessage));
  }
);

export default apiClient;
