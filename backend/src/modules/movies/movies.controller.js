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

/**
 * Controller to handle retrieving showtimes for a specific movie.
 */
export const getMovieShows = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { date } = req.query;

  const showtimes = await moviesService.getMoviesTimes(id);

  // Format shows for frontend mapping compatibility
  const formattedShows = showtimes.map(show => ({
    id: show.id,
    start_time: `${date || new Date().toISOString().split('T')[0]}T${show.time}:00`,
    screen_name: show.format,
    status: show.status,
  }));

  res.status(200).json({
    status: 'success',
    data: {
      shows: formattedShows,
    },
  });
});




const getSeats = catchAsync(async (req, res) => {
  const result = await moviesService.getSeats();

  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
});



// const getMovieShowSeats = catchAsync(async (req, res) => {
//   const { showId, movieId } = req.params;

//   console.log("-------->>>>", req.params)
//   const result = await moviesService.getShowSeats(showId, movieId);

//   res.status(200).json({
//     status: 'success',
//     data: {
//       result,
//     },
//   });
// });




export default {
  getMovies,
  getMovieById,
  getMovieShows,

  getSeats,
  // getMovieShowSeats
};
