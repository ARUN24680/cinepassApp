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
    image          TEXT           NOT NULL
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

    console.log('\n🎉 Migration complete! Tables are ready.');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
};

run();
