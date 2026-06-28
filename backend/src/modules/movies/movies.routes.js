import { Router } from 'express';
import moviesController from './movies.controller.js';

const router = Router();

// Retrieve all movies (supports pagination & search)
router.get('/', moviesController.getMovies);

// Retrieve general template seats
router.get('/seats', moviesController.getSeats);

// Retrieve details of a specific movie
router.get('/:id', moviesController.getMovieById);

// Retrieve showtimes of a specific movie
router.get('/:id/shows', moviesController.getMovieShows);

router.get('/:showId/movies/:movieId/seats', moviesController.getMovieShowSeats);

export default router;
