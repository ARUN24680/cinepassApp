import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Configure Axios instance for global API queries.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Automatically include HttpOnly cookies with every request
});

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
