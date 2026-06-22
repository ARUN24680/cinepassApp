import logger from '../config/logger.js';
import env from '../config/env.js';

/**
 * Centralized Express Error Handling Middleware.
 * Operational errors (custom AppError classes) return clean, targeted JSON messages.
 * Unhandled/programming errors return generic messages in production to avoid leaking internals.
 */
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (env.NODE_ENV === 'development') {
    logger.error('Error details:', {
      message: err.message,
      statusCode: err.statusCode,
      stack: err.stack,
    });

    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errors: err.errors || null,
      stack: err.stack,
    });
  }

  // Production Mode
  if (err.isOperational) {
    // Expected operational error (validation, not found, etc.)
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errors: err.errors || null,
    });
  }

  // Unexpected programming/system error (leak warning!)
  logger.error('UNEXPECTED ERROR:', err);

  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!',
  });
};

export default errorHandler;
