import { ValidationError } from '../utils/errors.js';

/**
 * Generic Express middleware to validate request payload (body, query, params)
 * using a Zod schema.
 * 
 * @param {z.ZodSchema} schema - The Zod schema to validate against
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!result.success) {
    // Format Zod errors into a clean, human-readable list of validation errors
    const errorDetails = result.error.issues.map((err) => ({
      field: err.path.slice(1).join('.'), // Removes 'body', 'query', or 'params' prefix
      message: err.message,
    }));

    return next(new ValidationError('Input validation failed', errorDetails));
  }

  // Assign the parsed and sanitized data back to req objects
  // Note: req.query is read-only in Express 5, so we use Object.assign to mutate it
  req.body = result.data.body;
  Object.assign(req.query, result.data.query ?? {});
  Object.assign(req.params, result.data.params ?? {});

  next();
};

export default validate;
