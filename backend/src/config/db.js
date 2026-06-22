import pg from 'pg';
import env from './env.js';
import logger from './logger.js';

const { Pool } = pg;

// 1. Connection Pool Configuration
const poolConfig = {
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  // max: Maximum number of active connections in the pool.
  // In development, we keep it small (10). In production, we can scale it up (e.g., 50).
  max: env.NODE_ENV === 'production' ? 50 : 10,
  // idleTimeoutMillis: Close idle connections after 30 seconds to release database memory
  idleTimeoutMillis: 30000,
  // connectionTimeoutMillis: If a connection takes more than 2 seconds, fail-fast and throw an error.
  connectionTimeoutMillis: 2000,
};

// Cloud databases (like Supabase, Neon, AWS RDS) require SSL encrypted connections in production
if (env.DB_SSL) {
  poolConfig.ssl = {
    rejectUnauthorized: false,
  };
}

// 2. Initialize the Pool
const pool = new Pool(poolConfig);

// Listeners to monitor our pool's behavior
pool.on('connect', (client) => {
  logger.debug('New client acquired from the database pool');
});

pool.on('error', (err, client) => {
  logger.error('Unexpected database client error in pool', { error: err.message, stack: err.stack });
});

/**
 * 3. Shorthand Query Helper (For Single Queries)
 * Use this 90% of the time for simple SELECT, INSERT, UPDATE, DELETE queries.
 * The pool automatically handles acquiring the client, running the query, and releasing it.
 */
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;

    // Log how long the query took (crucial for finding slow queries in production!)
    logger.debug('Executed query', {
      text,
      duration: `${duration}ms`,
      rows: res.rowCount,
    });
    return res;
  } catch (error) {
    const duration = Date.now() - start;
    logger.error('Database query error', {
      text,
      duration: `${duration}ms`,
      error: error.message,
    });
    throw error;
  }
};

/**
 * 4. Acquire Client Helper (For Transactions)
 * If we need to perform a database transaction (multiple queries that succeed or fail together),
 * we MUST run them on the exact same connection client.
 * 
 * Usage:
 * const client = await getClient();
 * try {
 *   await client.query('BEGIN');
 *   await client.query('INSERT...');
 *   await client.query('COMMIT');
 * } catch {
 *   await client.query('ROLLBACK');
 * } finally {
 *   client.release(); // Crucial! Otherwise, you leak a connection.
 * }
 */
export const getClient = async () => {
  const client = await pool.connect();
  const start = Date.now();

  const release = client.release;
  // Overwrite release to automatically measure how long we held the client
  client.release = (err) => {
    const duration = Date.now() - start;
    logger.debug('Released client back to pool', { duration: `${duration}ms` });
    return release.apply(client, [err]);
  };

  return client;
};

/**
 * 5. Database Health Check
 * Runs when the Node.js server starts up. If Postgres is down, the server exits.
 */
export const checkDbConnection = async () => {
  try {
    const res = await query('SELECT NOW()');
    logger.info(`Database connected successfully. Server time: ${res.rows[0].now}`);
    return true;
  } catch (error) {
    logger.error('Database connection test failed. Make sure your local Postgres server is running and credentials in .env are correct.', {
      error: error.message,
    });
    return false;
  }
};

export default {
  query,
  getClient,
  checkDbConnection,
  pool,
};
