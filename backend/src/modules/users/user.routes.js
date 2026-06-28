import { Router } from 'express';
import userController from './user.controller.js';
import { validate } from '../../middlewares/validate.js';
import { registerSchema, loginSchema, changePasswordSchema } from './user.schema.js';
import { protect } from '../../middlewares/auth.js';

const router = Router();

router.post('/register', validate(registerSchema), userController.register);

router.post('/login', validate(loginSchema), userController.login);
router.post('/logout', userController.logout);

router.post('/change-password', protect, validate(changePasswordSchema), userController.changePassword);

export default router;
