import { query } from '../../config/db.js';

/**
 * Creates a new user record in the database.
 * 
 * @param {string} name - User's display name
 * @param {string} email - User's email address
 * @param {string} passwordHash - Already hashed password
 * @returns {Promise<object>} The newly created user record (excluding password_hash)
 */
export const createUser = async (name, email, passwordHash) => {
  // 1. We write raw parameterized SQL. The $1, $2, $3 are placeholders.
  // RETURNING * tells PostgreSQL to return the inserted row after execution.
  const sql = `
    INSERT INTO users (name, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, role, created_at, updated_at;
  `;

  // 2. We pass variables in an array. The database driver safe-escapes them,
  // preventing SQL Injection attacks.
  const { rows } = await query(sql, [name, email, passwordHash]);
  return rows[0];
};

/**
 * Finds a user by their email address.
 * (Crucial for verifying registration unique constraints and handling login).
 */
export const findByEmail = async (email) => {
  const sql = `
    SELECT id, name, email, password_hash, role, created_at, updated_at
    FROM users
    WHERE email = $1;
  `;

  const { rows } = await query(sql, [email]);
  return rows[0]; // Returns undefined if user is not found
};

/**
 * Finds a user by their unique UUID.
 */
export const findById = async (id) => {
  const sql = `
    SELECT id, name, email, role, created_at, updated_at
    FROM users
    WHERE id = $1;
  `;

  const { rows } = await query(sql, [id]);
  return rows[0];
};

/**
 * Retrieves only the password hash for a user by their ID.
 */
export const getPasswordHash = async (id) => {
  const sql = `
    SELECT password_hash
    FROM users
    WHERE id = $1;
  `;
  const { rows } = await query(sql, [id]);
  return rows[0]?.password_hash;
};

/**
 * Updates a user's password hash in the database.
 */
export const updatePassword = async (id, newPasswordHash) => {
  const sql = `UPDATE users
               SET password_hash = $2, updated_at = NOW()
               WHERE id = $1 
               RETURNING id, name, email, role, created_at, updated_at; `;
  const { rows } = await query(sql, [id, newPasswordHash]);
  return rows[0];
};

export default {
  createUser,
  findByEmail,
  findById,
  getPasswordHash,
  updatePassword,
};
