import userService from './user.service.js';
import { catchAsync } from '../../utils/errors.js';

/**
 * Handles HTTP POST request for user registration.
 * Wrapped in catchAsync to automatically catch asynchronous errors.
 */

export const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  // Delegate processing to the service layer
  const user = await userService.registerUser(name, email, password);

  // Return success response with 201 Created status
  res.status(201).json({
    status: 'success',
    data: { user },
  });
});

/**
 * Handles HTTP POST request for user login.
 */

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Delegate authentication to the service layer
  const authData = await userService.loginUser(email, password);

  // Return success response with 200 OK status containing the JWT token
  res.status(200).json({
    status: 'success',
    data: authData,
  });
});

export default {
  register,
  login,
};
