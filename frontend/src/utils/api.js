import apiClient from './apiClient';

/**
 * Universal CinePass Backend API Client utilizing Axios Interceptors
 */
export const api = {
  // Auth APIs
  login: (email, password) => apiClient.post('/users/login', { email, password }),
  logout: () => apiClient.post('/users/logout'),
  register: (name, email, password) => apiClient.post('/users/register', { name, email, password }),

  // Movies APIs
  getMovies: (search = '') => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiClient.get(`/movies${query}`);
  },

  getMovie: (id) =>
    apiClient.get(`/movies/${id}`),

  // Shows APIs
  getShows: (movieId, date) => {
    let query = `?movie_id=${movieId}`;
    if (date) query += `&date=${date}`;
    return apiClient.get(`/shows${query}`);
  },

  getShowSeats: (showId) =>
    apiClient.get(`/shows/${showId}/seats`),

  // Bookings APIs
  lockSeats: (showId, seatIds) =>
    apiClient.post('/bookings/lock', { show_id: showId, seat_ids: seatIds }),

  cancelBooking: (bookingId) =>
    apiClient.post(`/bookings/${bookingId}/cancel`),

  getBookingsHistory: () =>
    apiClient.get('/bookings/history'),
};

export default api;
