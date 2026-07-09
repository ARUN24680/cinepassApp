import bookingsRepository from './bookings.repository.js';
import { getClient } from '../../config/db.js';
import { ConflictError, ValidationError } from '../../utils/errors.js';

export const lockSeats = async (userId, showId, seatIds, bookingDate) => {
  if (!seatIds || seatIds.length === 0) {
    throw new ValidationError('At least one seat must be selected.');
  }
  if (!bookingDate) {
    throw new ValidationError('Booking date is required.');
  }

  // Acquire client for transaction
  const client = await getClient();

  try {
    // 1. Start the transaction
    await client.query('BEGIN');

    // 2. Query and lock the target seats using FOR UPDATE on static template to ensure safety
    const seats = await bookingsRepository.lockSeatsForUpdate(client, showId, seatIds);

    // Verify all requested seats exist in database
    if (seats.length !== seatIds.length) {
      throw new ValidationError('One or more selected seat IDs are invalid.');
    }

    // 3. Verify there are no booking conflicts for this specific date
    const conflicts = await bookingsRepository.checkConflicts(client, showId, bookingDate, seatIds);
    if (conflicts.length > 0) {
      throw new ConflictError('One or more of the selected seats are already locked or booked for this date.');
    }

    // 4. Calculate total price
    // Standard ticket = $12.50, Premium = $17.50
    let totalPrice = 0;
    for (const seat of seats) {
      if (seat.type === 'premium') {
        totalPrice += 17.50;
      } else {
        totalPrice += 12.50;
      }
    }

    // 5. Create pending booking record in bookings table with date and seat array
    const booking = await bookingsRepository.createBooking(client, userId, showId, bookingDate, seatIds, totalPrice);

    // 6. Generate a mock Stripe client secret to satisfy checkout flow
    const clientSecret = `pi_mock_secret_${Math.floor(Math.random() * 900000) + 100000}`;

    // 7. Commit the transaction successfully
    await client.query('COMMIT');

    return {
      booking_id: booking.id,
      client_secret: clientSecret,
    };
  } catch (error) {
    // Rollback changes on any failure
    await client.query('ROLLBACK');
    throw error;
  } finally {
    // Always release client back to pool to prevent leaks
    client.release();
  }
};

export default {
  lockSeats,
};
