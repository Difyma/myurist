import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'premium'],
    default: 'user'
  },
  subscription: {
    type: {
      type: String,
      enum: ['free', 'professional', 'business'],
      default: 'free'
    },
    expiresAt: Date,
    analysisCount: { type: Number, default: 0 },
    maxAnalysis: { type: Number, default: 3 }
  },
  settings: {
    defaultRole: {
      type: String,
      enum: ['executor', 'customer'],
      default: 'executor'
    },
    notifications: {
      email: { type: Boolean, default: true },
      analysisComplete: { type: Boolean, default: true }
    }
  },
  lastLogin: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Check if subscription is active
userSchema.methods.hasActiveSubscription = function() {
  if (this.subscription.type === 'free') return true;
  if (!this.subscription.expiresAt) return false;
  return new Date() < this.subscription.expiresAt;
};

// Check analysis limit
userSchema.methods.canAnalyze = function() {
  return this.subscription.analysisCount < this.subscription.maxAnalysis;
};

const User = mongoose.model('User', userSchema);

export default User;
