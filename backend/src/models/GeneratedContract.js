import mongoose from 'mongoose';

const generatedContractSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  template: {
    type: String,
    enum: ['dev', 'marketing', 'saas', 'freelance', 'consulting', 'other'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  params: {
    contractType: String,
    userRole: {
      type: String,
      enum: ['executor', 'customer']
    },
    prepayment: Number,
    hasStages: Boolean,
    totalSum: Number,
    ipRights: {
      type: String,
      enum: ['exclusive', 'license', 'work_for_hire']
    },
    penaltyRate: Number,
    limitLiability: Boolean,
    ndaClause: Boolean,
    nonCompete: Boolean,
    forceMajeure: Boolean,
    arbitration: Boolean,
    contractTerm: String
  },
  content: {
    type: String,
    required: true
  },
  filePath: String,
  status: {
    type: String,
    enum: ['draft', 'generated', 'downloaded'],
    default: 'draft'
  }
}, {
  timestamps: true
});

const GeneratedContract = mongoose.model('GeneratedContract', generatedContractSchema);

export default GeneratedContract;
