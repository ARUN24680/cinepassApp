import { Router } from 'express';
import bookingsController from './bookings.controller.js';
import { protect } from '../../middlewares/auth.js';

const router = Router();

router.post('/lock', protect, bookingsController.lockSeats);

export default router;
