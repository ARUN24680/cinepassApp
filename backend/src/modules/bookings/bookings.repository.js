import { query } from '../../config/db.js';

/**
 * Repository layer for Bookings and Transactional Seat locks.
 */

export const createBooking = async (client, userId, showId, bookingDate, seatIds, totalPrice) => {
  const sql = `
    INSERT INTO bookings (user_id, show_id, booking_date, seat_ids, total_price, status)
    VALUES ($1, $2, $3, $4, $5, 'pending')
    RETURNING id, user_id, show_id, booking_date, seat_ids, total_price, status, created_at, updated_at;
  `;
  const { rows } = await client.query(sql, [userId, showId, bookingDate, seatIds, totalPrice]);
  return rows[0];
};

export const checkConflicts = async (client, showId, bookingDate, seatIds) => {
  const sql = `
    SELECT id, seat_ids
    FROM bookings
    WHERE show_id = $1
      AND booking_date = $2
      AND status IN ('pending', 'confirmed')
      AND seat_ids && $3; -- checks overlap
  `;
  const { rows } = await client.query(sql, [showId, bookingDate, seatIds]);
  return rows;
};

export const getActiveBookingsForShow = async (showId, bookingDate) => {
  const sql = `
    SELECT seat_ids, status, created_at
    FROM bookings
    WHERE show_id = $1
      AND booking_date = $2
      AND status IN ('pending', 'confirmed');
  `;
  const { rows } = await query(sql, [showId, bookingDate]);
  return rows;
};

export const lockSeatsForUpdate = async (client, showId, seatIds) => {
  const sql = `
    SELECT id, col_num, row_num, seat_id, status, type
    FROM show_seats
    WHERE show_seat_id = $1 AND seat_id = ANY($2)
    FOR UPDATE;
  `;
  const { rows } = await client.query(sql, [showId, seatIds]);
  return rows;
};

export const updateSeatsStatus = async (client, showId, seatIds, status, bookingId) => {
  const sql = `
    UPDATE show_seats
    SET status = $3, booking_id = $4
    WHERE show_seat_id = $1 AND seat_id = ANY($2)
    RETURNING id, col_num, row_num, seat_id, status, type, booking_id;
  `;
  const { rows } = await client.query(sql, [showId, seatIds, status, bookingId]);
  return rows;
};

export default {
  createBooking,
  checkConflicts,
  getActiveBookingsForShow,
  lockSeatsForUpdate,
  updateSeatsStatus,
};
