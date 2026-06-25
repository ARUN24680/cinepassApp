import { Router } from 'express';
import moviesController from './movies.controller.js';

const router = Router();

// Retrieve all movies (supports pagination & search)
router.get('/', moviesController.getMovies);

// Retrieve details of a specific movie
router.get('/:id', moviesController.getMovieById);

export default router;
