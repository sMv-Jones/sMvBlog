import express from 'express';
import * as authCtrl from '../controllers/auth.js';
import { protect, OTP } from '../middlewares/auth.js';
import { registerValidation, loginValidation, verifyOtpValidation } from '../validators/auth.js';
import { validate } from '../middlewares/validate.js';
import { authLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, registerValidation, validate, authCtrl.registerUser);
router.post('/login', authLimiter, loginValidation, validate, authCtrl.loginUser);
router.post('/logout', authCtrl.logoutUser);
router.get('/me', protect, authCtrl.getCurrentUser);
router.post("/verify-email", OTP, verifyOtpValidation, validate, authCtrl.verfiyRegister);

export default router;