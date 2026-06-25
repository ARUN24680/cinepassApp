import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import { UnauthorizedError } from '../utils/errors.js';
import userRepository from '../modules/users/user.repository.js';
import { catchAsync } from '../utils/errors.js';

/**
 * Middleware to protect routes. Verifies the JWT token in cookies
 * or authorization headers and binds the authenticated user to req.user.
 */
export const protect = catchAsync(async (req, res, next) => {
    let token;

    // 1. Try to extract token from HttpOnly cookie
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    // 2. Fallback: Try to extract token from Authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // If no token is found, block access
    if (!token) {
        return next(new UnauthorizedError('You are not logged in. Please log in to gain access.'));
    }

    try {
        // 3. Cryptographically verify the token
        const decoded = jwt.verify(token, env.JWT_SECRET);

        // 4. Check if the user still exists in the Postgres database
        const currentUser = await userRepository.findById(decoded.id);
        if (!currentUser) {
            return next(new UnauthorizedError('The user belonging to this session no longer exists.'));
        }

        // 5. Attach the user context to the request and proceed
        req.user = currentUser;
        next();
    } catch (err) {
        return next(new UnauthorizedError('Session expired or invalid token. Please log in again.'));
    }
});
