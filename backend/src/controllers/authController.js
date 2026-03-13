import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/error.js';
import { createAndSendOTP, verifyOTP } from '../services/otpService.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

export const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, company } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      success: false,
      message: 'User already exists'
    });
  }

  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
    company
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      company: user.company,
      role: user.role,
      subscription: user.subscription
    }
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user._id);

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      company: user.company,
      role: user.role,
      subscription: user.subscription,
      settings: user.settings
    }
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({
    success: true,
    user
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, company, settings } = req.body;

  const updateData = {};
  if (firstName) updateData.firstName = firstName;
  if (lastName) updateData.lastName = lastName;
  if (company) updateData.company = company;
  if (settings) updateData.settings = settings;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    updateData,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    user
  });
});

export const demoLogin = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  // Use provided email or default demo email
  const userEmail = email || 'demo@legalflow.ru';
  
  // Find or create demo user
  let user = await User.findOne({ email: userEmail });
  
  if (!user) {
    // Extract name from email (e.g., john.doe@example.com -> John Doe)
    const emailPrefix = userEmail.split('@')[0];
    const nameParts = emailPrefix.split(/[._-]/).filter(Boolean);
    const firstName = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : 'Демо';
    const lastName = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : 'Пользователь';
    
    user = await User.create({
      email: userEmail,
      password: 'demo123456',
      firstName,
      lastName,
      subscription: {
        type: 'professional',
        analysisCount: 0,
        maxAnalysis: 10
      }
    });
  }

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user._id);

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      subscription: user.subscription
    }
  });
});

// Request OTP code
export const requestOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      message: 'Пожалуйста, введите корректный email'
    });
  }

  const result = await createAndSendOTP(email);

  if (!result.success) {
    return res.status(500).json({
      success: false,
      message: 'Ошибка при отправке кода. Попробуйте позже.'
    });
  }

  res.json({
    success: true,
    message: 'Код подтверждения отправлен на ваш email'
  });
});

// Verify OTP and login
export const verifyOTPAndLogin = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({
      success: false,
      message: 'Пожалуйста, введите email и код подтверждения'
    });
  }

  // Verify OTP code
  const verification = await verifyOTP(email, code);

  if (!verification.success) {
    return res.status(401).json({
      success: false,
      message: verification.error || 'Неверный код подтверждения'
    });
  }

  // Find or create user
  let user = await User.findOne({ email });
  
  if (!user) {
    // Extract name from email (e.g., john.doe@example.com -> John Doe)
    const emailPrefix = email.split('@')[0];
    const nameParts = emailPrefix.split(/[._-]/).filter(Boolean);
    const firstName = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : 'Демо';
    const lastName = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : 'Пользователь';
    
    user = await User.create({
      email,
      password: 'demo123456',
      firstName,
      lastName,
      subscription: {
        type: 'professional',
        analysisCount: 0,
        maxAnalysis: 10
      }
    });
  }

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user._id);

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      subscription: user.subscription
    }
  });
});
