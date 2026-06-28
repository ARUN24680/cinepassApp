import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from './user.repository.js';
import env from '../../config/env.js';
import { ConflictError, UnauthorizedError } from '../../utils/errors.js';

/**
 * Register a new user.
 */
export const registerUser = async (name, email, password) => {
  // 1. Business rule check: Is the email already registered?
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new ConflictError('A user with this email address already exists.');
  }

  // 2. Security requirement: Hash the password. Never store plain text passwords!
  // Salt rounds = 12 (standard for production balancing speed and cryptographical strength)
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // 3. Delegate database insertion to the Repository layer
  const newUser = await userRepository.createUser(name, email, passwordHash);
  return newUser;
};

/**
 * Authenticate a user and issue a JWT token.
 */
export const loginUser = async (email, password) => {
  // 1. Retrieve the user from the database
  const user = await userRepository.findByEmail(email);
  if (!user) {
    // Security tip: Use generic error message to prevent User Enumeration attacks
    throw new UnauthorizedError('Invalid email or password.');
  }

  // 2. Verify password correctness by comparing the hash
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password.');
  }

  // 3. Generate a JWT token containing user identity details
  const token = jwt.sign(
    { id: user.id, role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );

  // 4. Exclude password_hash from return values
  const { password_hash, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
};

/**
 * Changes a user's password after validating the current password.
 */
export const changePasswordUser = async (userId, currentPassword, newPassword) => {
  // 1. Retrieve the current password hash from the repository
  const storedHash = await userRepository.getPasswordHash(userId);
  if (!storedHash) {
    throw new UnauthorizedError('User not found.');
  }

  // 2. Compare the current password with the stored hash
  const isCurrentPasswordCorrect = await bcrypt.compare(currentPassword, storedHash);
  if (!isCurrentPasswordCorrect) {
    throw new UnauthorizedError('Incorrect current password.');
  }

  // 3. Hash the new password
  const saltRounds = 12;
  const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

  // 4. Update password in database
  const updatedUser = await userRepository.updatePassword(userId, newPasswordHash);
  return updatedUser;
};

export default {
  registerUser,
  loginUser,
  changePasswordUser,
};
