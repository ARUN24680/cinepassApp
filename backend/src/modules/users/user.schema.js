import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' })
      .trim()
      .min(2, 'Name must be at least 2 characters long')
      .max(50, 'Name cannot exceed 50 characters'),
    email: z.string({ required_error: 'Email is required' })
      .trim()
      .email('Invalid email address format'),
    password: z.string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters long')
      .max(100, 'Password cannot exceed 100 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' })
      .trim()
      .email('Invalid email address format'),
    password: z.string({ required_error: 'Password is required' })
      .min(1, 'Password is required'),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string({ required_error: 'Current password is required' })
      .min(1, 'Current password is required'),
    newPassword: z.string({ required_error: 'New password is required' })
      .min(8, 'New password must be at least 8 characters long')
      .max(100, 'New password cannot exceed 100 characters')
      .refine((val) => /\d/.test(val), { message: 'New password must contain at least one number' })
      .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), { message: 'New password must contain at least one special character' }),
    confirmPassword: z.string({ required_error: 'Confirm password is required' }),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  }),
});

export default {
  registerSchema,
  loginSchema,
  changePasswordSchema,
};
