import { create } from 'zustand';

/**
 * Zustand Store for user authentication sessions
 * Safe for Server-Side Rendering (SSR) in Next.js
 */
export const useAuthStore = create((set) => ({
  user: null,
  // token: null,
  isLoggedIn: false,
  isInitialized: false,

  /**
   * Initializes store state from localStorage (run only on client-side mount)
   */
  initialize: () => {
    if (typeof window === 'undefined') return;

    try {
      // const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      set({
        // token,
        user,
        isLoggedIn: !!user,
        isInitialized: true,
      });
    } catch (e) {
      console.error('Failed to initialize auth store from localStorage:', e);
      set({ isInitialized: true });
    }
  },

  /**
   * Sets the active user session and persists to localStorage
   */
  setSession: (user, token) => {
    if (typeof window !== 'undefined') {
      // localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({
      user,
      // token,
      isLoggedIn: true,
    });
  },

  /**
   * Logs out the user and clears localStorage
   */
  logout: () => {
    if (typeof window !== 'undefined') {
      // localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    set({
      user: null,
      token: null,
      isLoggedIn: false,
    });
  },
}));

export default useAuthStore;
