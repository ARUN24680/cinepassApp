const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Helper to get the auth headers.
 */
const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Universal fetch wrapper for standard operations.
 */
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = { ...getHeaders(), ...options.headers };
  const config = { ...options, headers };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export const api = {
  // Auth APIs
  login: (email, password) =>
    request('/users/login', {
      method: 'POST',
      body: { email, password },
    }),

  register: (name, email, password) =>
    request('/users/register', {
      method: 'POST',
      body: { name, email, password },
    }),

  // Movies APIs
  getMovies: (search = '') => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request(`/movies${query}`);
  },

  getMovie: (id) => request(`/movies/${id}`),

  // Shows APIs
  getShows: (movieId, date) => {
    let query = `?movie_id=${movieId}`;
    if (date) query += `&date=${date}`;
    return request(`/shows${query}`);
  },

  getShowSeats: (showId) => request(`/shows/${showId}/seats`),

  // Bookings APIs
  lockSeats: (showId, seatIds) =>
    request('/bookings/lock', {
      method: 'POST',
      body: { show_id: showId, seat_ids: seatIds },
    }),

  cancelBooking: (bookingId) =>
    request(`/bookings/${bookingId}/cancel`, {
      method: 'POST',
    }),

  getBookingsHistory: () => request('/bookings/history'),
};

export default api;
