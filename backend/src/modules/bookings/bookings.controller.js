import bookingsService from './bookings.service.js';
import { catchAsync } from '../../utils/errors.js';

export const lockSeats = catchAsync(async (req, res) => {
  const { show_id, seat_ids, booking_date } = req.body;
  const userId = req.user.id;
  const date = booking_date || new Date().toISOString().split('T')[0];
  const result = await bookingsService.lockSeats(userId, show_id, seat_ids, date);

  res.status(200).json({
    status: 'success',
    data: result,
  });
});

export default {
  lockSeats,
};
