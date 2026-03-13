import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  code: {
    type: String,
    required: true
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // Автоматическое удаление через 10 минут
  }
});

// Index for faster lookup
otpSchema.index({ email: 1, code: 1 });

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;
