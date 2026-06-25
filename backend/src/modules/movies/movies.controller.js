import moviesService from './movies.service.js';
import { catchAsync } from '../../utils/errors.js';

/**
 * Controller to handle retrieving list of movies.
 */
export const getMovies = catchAsync(async (req, res) => {
  const { page, limit, search } = req.query;

  const result = await moviesService.getMoviesList({ page, limit, search });

  res.status(200).json({
    status: 'success',
    results: result.movies.length,
    total: result.total,
    page: result.page,
    data: {
      movies: result.movies,
    },
  });
});

/**
 * Controller to handle retrieving a single movie by ID.
 */
export const getMovieById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const movie = await moviesService.getMovie(id);

  res.status(200).json({
    status: 'success',
    data: {
      movie,
    },
  });
});

export default {
  getMovies,
  getMovieById,
};
