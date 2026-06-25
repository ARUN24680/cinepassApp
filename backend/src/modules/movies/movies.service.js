import moviesRepository from './movies.repository.js';
import { NotFoundError } from '../../utils/errors.js';

/**
 * Service to fetch a list of movies with pagination and search criteria.
 */
export const getMoviesList = async ({ page = 1, limit = 10, search }) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 10);
  const offset = (pageNum - 1) * limitNum;

  // Retrieve movies list and count matching criteria
  const [movies, total] = await Promise.all([
    moviesRepository.findAll({ limit: limitNum, offset, search }),
    moviesRepository.countAll({ search }),
  ]);

  return {
    movies,
    total,
    page: pageNum,
    limit: limitNum,
  };
};

/**
 * Service to retrieve a single movie details.
 */
export const getMovie = async (id) => {
  const movie = await moviesRepository.findById(id);
  if (!movie) {
    throw new NotFoundError(`Movie with ID ${id} not found.`);
  }
  return movie;
};

export default {
  getMoviesList,
  getMovie,
};
