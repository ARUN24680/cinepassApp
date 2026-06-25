import { Router } from 'express';
import userController from './user.controller.js';
import { validate } from '../../middlewares/validate.js';
import { registerSchema, loginSchema } from './user.schema.js';
import { protect } from '../../middlewares/auth.js';

const router = Router();

router.post('/register', validate(registerSchema), userController.register);

router.post('/login', validate(loginSchema), userController.login);
router.post('/logout', userController.logout);


// Protected routes (Only logged in users can access)
router.get('/me', protect, (req, res) => {
    res.status(200).json({
        status: 'success',
        data: { user: req.user } // req.user was attached by the protect middleware!
    });
});


export default router;
