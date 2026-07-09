import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new pg.Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id          SERIAL        PRIMARY KEY,
    name        VARCHAR(50)   NOT NULL,
    email       VARCHAR(255)  UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role        VARCHAR(50)   NOT NULL DEFAULT 'user',
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
  );
`;

const createTasksTable = `
  CREATE TABLE IF NOT EXISTS tasks (
    id          SERIAL        PRIMARY KEY,
    title       VARCHAR(255)  NOT NULL,
    description TEXT,
    status      VARCHAR(50)   NOT NULL DEFAULT 'pending',
    user_id     INTEGER       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
  );
`;

const createMoviesTable = `
  CREATE TABLE IF NOT EXISTS movies (
    id             SERIAL         PRIMARY KEY,
    title          VARCHAR(255)   NOT NULL, 
    rating         DECIMAL(3, 1)  DEFAULT 0.0,
    genre          VARCHAR(255)   NOT NULL,
    duration_mins  INTEGER        NOT NULL,
    image          TEXT           NOT NULL,
    release_date   TEXT           NOT NULL,
    description    TEXT           NOT NULL,
    backdrop       TEXT           NOT NULL,
    poster         TEXT           NOT NULL,
    "cast"         JSONB          NOT NULL,  
    created_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW()
  );
`;

const createMoviesTimesTable = `
  CREATE TABLE IF NOT EXISTS movies_times (
    id             SERIAL         PRIMARY KEY,
    time           VARCHAR(255)   NOT NULL, 
    format         VARCHAR(255)   NOT NULL,
    status         VARCHAR(255)   NOT NULL,
    movie_id       INTEGER        NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    created_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW()
  );
`;

const createBookingsTable = `
 CREATE TABLE IF NOT EXISTS bookings (
  id             SERIAL           PRIMARY KEY,
  user_id        INTEGER          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  show_id        INTEGER          NOT NULL REFERENCES movies_times(id) ON DELETE CASCADE,
  booking_date   DATE             NOT NULL,                    -- Target booking date (e.g., '2026-10-24')
  seat_ids       INTEGER[]        NOT NULL,                    -- Array of booked seat IDs (e.g., '{12, 13}')
  total_price    DECIMAL(10, 2)   NOT NULL,
  status         VARCHAR(255)     NOT NULL DEFAULT 'pending',  -- 'pending' (locked), 'confirmed', 'cancelled'
  created_at     TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);
`;







const createShowSeatsTable = `
  CREATE TABLE IF NOT EXISTS show_seats (
    id             SERIAL           PRIMARY KEY,
    col_num        INTEGER          NOT NULL, 
    row_num        VARCHAR(255)     NOT NULL,
    seat_id        INTEGER          NOT NULL,
    movie_id       INTEGER          NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    show_seat_id   INTEGER          NOT NULL REFERENCES movies_times(id) ON DELETE CASCADE,
    status         VARCHAR(255)     NOT NULL DEFAULT 'available',
    type           VARCHAR(255)     NOT NULL DEFAULT 'standard',
    booking_id     INTEGER          REFERENCES bookings(id) ON DELETE SET NULL
  );
`;


const createAllSeatsTable = `
  CREATE TABLE IF NOT EXISTS all_seats (
    id             SERIAL           PRIMARY KEY,
    col_num        INTEGER          NOT NULL, 
    row_num        VARCHAR(255)     NOT NULL, 
    status         VARCHAR(255)     NOT NULL DEFAULT 'available',
    type           VARCHAR(255)     NOT NULL DEFAULT 'standard'
  );
`;


const run = async () => {
  try {
    await client.connect();
    console.log('✅ Connected to database:', process.env.DB_NAME);

    console.log('⏳ Creating users table...');
    await client.query(createUsersTable);
    console.log('✅ users table ready');

    console.log('⏳ Creating tasks table...');
    await client.query(createTasksTable);
    console.log('✅ tasks table ready');
    console.log('⏳ Creating movies table...');
    await client.query(createMoviesTable);
    console.log('✅ movies table ready');

    console.log('⏳ Creating movies times table...');
    await client.query(createMoviesTimesTable);
    console.log('✅ movies times table ready');

    console.log('⏳ Recreating bookings table...');
    await client.query('DROP TABLE IF EXISTS bookings CASCADE');
    await client.query(createBookingsTable);
    console.log('✅ bookings table ready');

    console.log('⏳ Recreating show seats table...');
    await client.query('DROP TABLE IF EXISTS show_seats CASCADE');
    await client.query(createShowSeatsTable);
    console.log('✅ show seats table ready');


    console.log('⏳ Recreating all seats table...');
    await client.query('DROP TABLE IF EXISTS all_seats CASCADE');
    await client.query(createAllSeatsTable);
    console.log('✅ all seats table ready');


    console.log('\n🎉 Migration complete! Tables are ready.');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
};

run();
