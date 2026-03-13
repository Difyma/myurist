import mongoose from 'mongoose';

const riskSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ['high', 'medium', 'low'],
    required: true
  },
  title: { type: String, required: true },
  text: String,
  article: String,
  description: String,
  recommendation: String,
  position: {
    page: Number,
    paragraph: Number
  }
}, { _id: false });

const contractSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['pdf', 'doc', 'docx', 'txt'],
    required: true
  },
  fileSize: Number,
  contractType: {
    type: String,
    enum: ['podryad', 'services', 'supply', 'nda', 'agency', 'oferta', 'other'],
    default: 'other'
  },
  userRole: {
    type: String,
    enum: ['executor', 'customer', 'unknown'],
    default: 'unknown'
  },
  status: {
    type: String,
    enum: ['pending', 'analyzing', 'completed', 'failed'],
    default: 'pending'
  },
  content: {
    text: String,
    pages: Number
  },
  analysis: {
    risks: [riskSchema],
    summary: {
      highRisks: { type: Number, default: 0 },
      mediumRisks: { type: Number, default: 0 },
      lowRisks: { type: Number, default: 0 },
      totalScore: { type: Number, default: 0 }
    },
    recommendations: [String],
    analyzedAt: Date
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  tags: [String]
}, {
  timestamps: true
});

// Indexes
contractSchema.index({ user: 1, createdAt: -1 });
contractSchema.index({ status: 1 });

const Contract = mongoose.model('Contract', contractSchema);

export default Contract;
