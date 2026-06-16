import express from 'express';
import * as authCtrl from '../controllers/auth.js';
import { protect } from '../middlewares/auth.js';
import { registerValidation, loginValidation } from '../validators/auth.js';
import { validate } from '../middlewares/validate.js';
import { authLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, registerValidation, validate, authCtrl.registerUser);
router.post('/login', authLimiter, loginValidation, validate, authCtrl.loginUser);
router.post('/logout', authCtrl.logoutUser);
router.get('/me',  protect, authCtrl.getCurrentUser);

export default router;