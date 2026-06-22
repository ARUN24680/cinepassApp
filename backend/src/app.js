import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import logger from './config/logger.js';
import { NotFoundError } from './utils/errors.js';
import errorHandler from './middlewares/error.js';
import userRoutes from './modules/users/user.routes.js';

const app = express();

// 1. Security Headers Middleware
app.use(helmet());

// 2. CORS Middleware
app.use(cors());

// 3. Rate Limiting Middleware (prevents brute-force / DDoS attacks)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    status: 'fail',
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api', limiter);

// 4. Request Body Parsing Middleware
app.use(express.json({ limit: '10kb' })); // Limits body size to prevent payload-based attacks

// 5. Basic Request Logger (HTTP logger)
app.use((req, res, next) => {
  logger.http(`${req.method} ${req.originalUrl}`);
  next();
});

// 6. Routes
app.use('/api/users', userRoutes);

// 7. Wildcard Route (404 Not Found handling)
app.all(/(.*)/, (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`));
});

// 8. Centralized Global Error Handler Middleware
app.use(errorHandler);

export default app;
