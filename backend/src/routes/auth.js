import express from 'express';
import { register, login, getMe, updateProfile, demoLogin, requestOTP, verifyOTPAndLogin } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/demo', demoLogin);
router.post('/otp/request', requestOTP);
router.post('/otp/verify', verifyOTPAndLogin);
router.get('/me', protect, getMe);
router.patch('/profile', protect, updateProfile);

export default router;
