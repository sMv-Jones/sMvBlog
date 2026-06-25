import express from 'express';
import * as authCtrl from '../controllers/auth.js';
import { protect, OTP } from '../middlewares/auth.js';
import * as validators from '../validators/auth.js';
import { validate } from '../middlewares/validate.js';
import { authLimiter, userApiLimiter, userAuthChangeLimiter, userForgotPasswordLimiter } from '../middlewares/rateLimiter.js';
import { upload } from '../configs/azureStorage.js';
const router = express.Router();

router.post('/register', authLimiter, validators.registerValidation, validate, authCtrl.registerUser);
router.post('/login', authLimiter, validators.loginValidation, validate, authCtrl.loginUser);
router.post('/logout', authCtrl.logoutUser);
router.post("/verify-email", OTP, validators.verifyOtpValidation, validate, authCtrl.verfiyRegister);

router.get('/me', protect, userApiLimiter, authCtrl.getCurrentUser);
router.get("/profile", protect, userApiLimiter, authCtrl.getProfile)
router.put("/profile", protect, validators.updateProfileValidator, validate, upload.single('profilePhoto'), authCtrl.updateProfile)

router.post('/send-password-otp', protect, userAuthChangeLimiter, authCtrl.sendPasswordOtp);
router.post('/change-password', protect, userAuthChangeLimiter, validators.changePasswordValidator, validate, authCtrl.changePassword);
router.post('/send-delete-otp', protect, userAuthChangeLimiter, authCtrl.sendDeleteAccountOtp);
router.delete('/delete-account', protect, userAuthChangeLimiter, validators.deleteAccountValidator, validate, authCtrl.deleteAccount);

router.post('/forgot-password', userForgotPasswordLimiter, validators.forgotPasswordValidator, validate, authCtrl.requestPasswordResetOtp);
router.post('/reset-password', userForgotPasswordLimiter, validators.resetPasswordValidator, validate, authCtrl.resetPasswordWithOtp);

export default router;