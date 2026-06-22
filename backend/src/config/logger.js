import winston from 'winston';
import env from './env.js'; // Imports our validated environment variables

// 1. Define Log Levels
// Levels represent the severity of the log. 0 is the highest severity (most critical).
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// 2. Define colors for each log level (used for development readability)
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Bind these colors to Winston
winston.addColors(colors);

// 3. Format: Development vs Production
// In DEVELOPMENT, we want colorful, readable logs: [timestamp] level: message
const devFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }), // Colorizes the log based on its level
  winston.format.printf(
    (info) => `[${info.timestamp}] ${info.level}: ${info.message}` + (info.stack ? `\n${info.stack}` : '')
  )
);

// In PRODUCTION, we want structured JSON logs. Why JSON? 
// Because cloud aggregators (Datadog, AWS CloudWatch, ELK) can easily index, search, and set alerts on JSON fields.
const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }), // Automatically appends the error stack trace
  winston.format.json() // Outputs as a single JSON line
);

// 4. Transports (Where do the logs go?)
const transports = [];

if (env.NODE_ENV === 'production') {
  // In production, we log:
  // - Errors to logs/error.log
  // - Everything (info, warn, error) to logs/combined.log
  // - Also output to the container/server console (standard stdout)
  transports.push(
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console()
  );
} else {
  // In development, just print to the console with pretty colors
  transports.push(new winston.transports.Console());
}

// 5. Create the Logger Instance
const logger = winston.createLogger({
  // Only log if the severity is equal or higher than the current environment level
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  levels,
  format: env.NODE_ENV === 'development' ? devFormat : prodFormat,
  transports,
});

export default logger;
