import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import logger from './config/logger.js';
import { NotFoundError } from './utils/errors.js';
import errorHandler from './middlewares/error.js';
import userRoutes from './modules/users/user.routes.js';
import moviesRoutes from './modules/movies/movies.routes.js';
import cookieParser from 'cookie-parser';

const app = express();

// 1. Security Headers Middleware
app.use(helmet());


const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  process.env.FRONTEND_URL
].filter(Boolean);


app.use(cors({
  origin: function (origin, callback) {
    // Allow server-to-server requests or requests with no origin (like mobile/Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Cookie Parser Middleware
app.use(cookieParser());


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
app.use('/api/movies', moviesRoutes);

// 7. Wildcard Route (404 Not Found handling)
app.all(/(.*)/, (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`));
});

// 8. Centralized Global Error Handler Middleware
app.use(errorHandler);

export default app;
