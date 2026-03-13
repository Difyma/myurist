import Contract from '../models/Contract.js';
import GeneratedContract from '../models/GeneratedContract.js';
import { asyncHandler } from '../middleware/error.js';
import { generateContractDocument } from '../services/contractGenerator.js';
import path from 'path';

// Upload and analyze contract
export const uploadContract = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please upload a file'
    });
  }

  const { contractType, userRole } = req.body;

  const contract = await Contract.create({
    user: req.user.id,
    originalName: req.file.originalname,
    fileName: req.file.filename,
    filePath: req.file.path,
    fileType: path.extname(req.file.originalname).toLowerCase().replace('.', ''),
    fileSize: req.file.size,
    contractType: contractType || 'other',
    userRole: userRole || 'unknown',
    status: 'pending'
  });

  // Increment analysis count
  req.user.subscription.analysisCount += 1;
  await req.user.save();

  // Trigger async analysis (in production, use a job queue)
  analyzeContractAsync(contract._id);

  res.status(201).json({
    success: true,
    contract: {
      id: contract._id,
      originalName: contract.originalName,
      status: contract.status,
      createdAt: contract.createdAt
    }
  });
});

// Get all contracts for user
export const getContracts = asyncHandler(async (req, res) => {
  const contracts = await Contract.find({ user: req.user.id })
    .select('originalName contractType status analysis.summary createdAt')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: contracts.length,
    contracts
  });
});

// Get single contract
export const getContract = asyncHandler(async (req, res) => {
  const contract = await Contract.findOne({
    _id: req.params.id,
    user: req.user.id
  });

  if (!contract) {
    return res.status(404).json({
      success: false,
      message: 'Contract not found'
    });
  }

  res.json({
    success: true,
    contract
  });
});

// Delete contract
export const deleteContract = asyncHandler(async (req, res) => {
  const contract = await Contract.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id
  });

  if (!contract) {
    return res.status(404).json({
      success: false,
      message: 'Contract not found'
    });
  }

  res.json({
    success: true,
    message: 'Contract deleted'
  });
});

// Generate new contract
export const generateContract = asyncHandler(async (req, res) => {
  const { template, params, title } = req.body;

  const content = generateContractDocument(template, params);

  const generatedContract = await GeneratedContract.create({
    user: req.user.id,
    template,
    title: title || 'Новый договор',
    params,
    content,
    status: 'generated'
  });

  res.status(201).json({
    success: true,
    contract: {
      id: generatedContract._id,
      title: generatedContract.title,
      content: generatedContract.content,
      createdAt: generatedContract.createdAt
    }
  });
});

// Get generated contracts
export const getGeneratedContracts = asyncHandler(async (req, res) => {
  const contracts = await GeneratedContract.find({ user: req.user.id })
    .select('title template status createdAt')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: contracts.length,
    contracts
  });
});

// Async analysis function (mock implementation)
async function analyzeContractAsync(contractId) {
  try {
    const contract = await Contract.findById(contractId);
    if (!contract) return;

    contract.status = 'analyzing';
    await contract.save();

    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock analysis results
    const mockRisks = [
      {
        level: 'high',
        title: 'Одностороннее изменение объема работ',
        text: '«Заказчик вправе в одностороннем порядке изменить объем работ»',
        article: 'Ст. 310 ГК РФ',
        description: 'Изменение договора возможно только по соглашению сторон.',
        recommendation: 'Заменить на: «Изменения возможны только при согласовании сторон»'
      },
      {
        level: 'high',
        title: 'Неограниченная ответственность',
        text: '«Исполнитель несет ответственность за все убытки»',
        article: 'Ст. 15, 393 ГК РФ',
        description: 'Отсутствие ограничения ответственности.',
        recommendation: 'Добавить ограничение размером договора'
      },
      {
        level: 'medium',
        title: 'Несоразмерная неустойка',
        text: '«Неустойка 1% за каждый день просрочки»',
        article: 'Ст. 333 ГК РФ',
        description: '365% годовых значительно превышает ключевую ставку ЦБ.',
        recommendation: 'Установить 0,1% в день'
      }
    ];

    contract.analysis = {
      risks: mockRisks,
      summary: {
        highRisks: mockRisks.filter(r => r.level === 'high').length,
        mediumRisks: mockRisks.filter(r => r.level === 'medium').length,
        lowRisks: 0,
        totalScore: 35
      },
      recommendations: [
        'Внесите правки в пункты 4.2 и 8.1',
        'Снизьте неустойку до 0,1%',
        'Добавьте срок рассмотрения результата'
      ],
      analyzedAt: new Date()
    };

    contract.status = 'completed';
    await contract.save();

  } catch (error) {
    console.error('Analysis error:', error);
    await Contract.findByIdAndUpdate(contractId, { status: 'failed' });
  }
}
