import { Router } from 'express';
import userController from './user.controller.js';
import { validate } from '../../middlewares/validate.js';
import { registerSchema, loginSchema } from './user.schema.js';

const router = Router();

router.post('/register', validate(registerSchema), userController.register);

router.post('/login', validate(loginSchema), userController.login);

export default router;
