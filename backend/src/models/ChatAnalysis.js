import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['me', 'other'],
    required: true
  },
  text: { type: String, required: true },
  time: String,
  isSignificant: { type: Boolean, default: false }
}, { _id: false });

const findingSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['oral_agreement', 'scope_change', 'payment_confirmation', 'deadline', 'acceptance', 'risk'],
    required: true
  },
  level: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  title: String,
  description: String,
  relatedMessages: [Number],
  recommendation: String
}, { _id: false });

const chatAnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  source: {
    type: String,
    enum: ['telegram', 'whatsapp', 'email', 'other'],
    required: true
  },
  originalName: String,
  messages: [messageSchema],
  analysis: {
    findings: [findingSchema],
    summary: String,
    riskLevel: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'analyzing', 'completed', 'failed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const ChatAnalysis = mongoose.model('ChatAnalysis', chatAnalysisSchema);

export default ChatAnalysis;
