import app from './app.js';
import env from './config/env.js';
import db from './config/db.js';
import logger from './config/logger.js';

// Handle Uncaught Exceptions (synchronous errors that were not caught)
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', {
    error: err.message,
    stack: err.stack,
  });
  process.exit(1);
});

let server;

const startServer = async () => {
  // 1. Verify Database Connection
  const dbConnected = await db.checkDbConnection();
  if (!dbConnected) {
    logger.error('❌ Could not start server because database connection failed.');
    process.exit(1);
  }

  // 2. Start HTTP Server
  server = app.listen(env.PORT, () => {
    logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  });

  // Handle Unhandled Promise Rejections (asynchronous errors that were not caught)
  process.on('unhandledRejection', (err) => {
    logger.error('UNHANDLED REJECTION! Shutting down...', {
      error: err.message,
      stack: err.stack,
    });

    // Gracefully shut down the server first, then exit
    if (server) {
      server.close(() => {
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
};

// Graceful Shutdown Handler
const gracefulShutdown = (signal) => {
  logger.info(`👋 ${signal} received. Starting graceful shutdown...`);

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed.');

      try {
        // Close PostgreSQL Pool
        await db.pool.end();
        logger.info('Database pool closed.');
        process.exit(0);
      } catch (err) {
        logger.error('Error closing database pool during shutdown', err);
        process.exit(1);
      }
    });
  } else {
    process.exit(0);
  }
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();
