import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';

/**
 * Custom React Query hook to retrieve movies from the backend.
 * Integrates search parameters dynamically, utilizing TanStack Query cache keys.
 */
export function useMoviesQuery(search = '') {
  return useQuery({
    queryKey: ['movies', search],
    queryFn: async () => {
      const res = await api.getMovies(search);
      if (res.data && res.data.movies && res.data.movies.length > 0) {
        return res.data.movies.map((m) => ({
          id: m.id,
          title: m.title,
          rating: m.rating || '4.0',
          genre: m.genre || 'Action',
          duration_mins: m.duration_mins || 120,
          image: m.image,
        }));
      }
      return []; // Return empty array if no movies found (will fall back in UI component)
    },
    staleTime: 5 * 60 * 1000, // Cache results for 5 minutes
    refetchOnWindowFocus: false, // Prevent unwanted queries on tab refocus
  });
}

/**
 * Custom React Query hook to retrieve details of a specific movie.
 */
export function useMovieQuery(id) {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: async () => {
      const res = await api.getMovie(id);
      return res.data?.movie || null;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
