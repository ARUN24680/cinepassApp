import { useMutation } from '@tanstack/react-query';
import api from '@/utils/api';
import useAuthStore from '@/store/useAuthStore';

/**
 * Custom React Query hook for user Login
 */
export function useLoginMutation() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await api.login(email, password);
      return res;
    },
    onSuccess: (res) => {
      if (res.status === 'success' && res.data) {
        setSession(res.data.user, res.data.token);
      }
    },
  });
}

/**
 * Custom React Query hook for user Registration (includes auto-login)
 */
export function useRegisterMutation() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: async ({ name, email, password }) => {
      // 1. Perform registration
      const registerRes = await api.register(name, email, password);
      
      if (registerRes.status === 'success') {
        // 2. Perform automatic login
        const loginRes = await api.login(email, password);
        return { registerRes, loginRes };
      }
      
      throw new Error(registerRes.message || 'Registration failed');
    },
    onSuccess: (res) => {
      const { loginRes } = res;
      if (loginRes?.status === 'success' && loginRes.data) {
        setSession(loginRes.data.user, loginRes.data.token);
      }
    },
  });
}
