import Contract from '../models/Contract.js';
import GeneratedContract from '../models/GeneratedContract.js';
import { asyncHandler } from '../middleware/error.js';
import { generateContractDocument } from '../services/contractGenerator.js';
import { extractText } from '../services/documentParser.js';
import { analyzeContractWithAI, getMockAnalysis } from '../services/aiAnalysis.js';
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

  // Trigger async analysis
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

// Async analysis function with real AI
async function analyzeContractAsync(contractId) {
  try {
    const contract = await Contract.findById(contractId);
    if (!contract) return;

    contract.status = 'analyzing';
    await contract.save();

    let analysis;
    let extractedText = '';

    try {
      // Step 1: Extract text from document
      console.log(`Extracting text from ${contract.fileType} file...`);
      const extracted = await extractText(contract.filePath, contract.fileType);
      extractedText = extracted.text;
      
      contract.content = {
        text: extractedText.slice(0, 50000), // Store first 50k chars
        pages: extracted.pages
      };
      await contract.save();

      // Step 2: Analyze with AI if API key is available
      if (process.env.KIMI_API_KEY) {
        console.log('Analyzing with Kimi AI...');
        analysis = await analyzeContractWithAI(
          extractedText,
          contract.contractType,
          contract.userRole
        );
      } else {
        console.log('No Kimi API key, using mock analysis');
        analysis = getMockAnalysis(contract.contractType, contract.userRole);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      // Fallback to mock analysis on error
      analysis = getMockAnalysis(contract.contractType, contract.userRole);
      analysis.risks.unshift({
        level: 'low',
        title: 'Примечание: использована демо-аналитика',
        text: '',
        article: '',
        description: `Не удалось выполнить полный анализ: ${error.message}. Показаны типовые риски для данного типа договора.`,
        recommendation: 'Для полного анализа проверьте настройки API или попробуйте загрузить файл в другом формате (PDF или DOCX).'
      });
    }

    // Save analysis results
    contract.analysis = {
      risks: analysis.risks,
      summary: analysis.summary,
      recommendations: analysis.recommendations,
      analyzedAt: new Date()
    };
    contract.status = 'completed';
    await contract.save();

    console.log(`Analysis completed for contract ${contractId}`);

  } catch (error) {
    console.error('Fatal analysis error:', error);
    await Contract.findByIdAndUpdate(contractId, { 
      status: 'failed',
      'analysis.recommendations': [`Ошибка анализа: ${error.message}`]
    });
  }
}

// Get analysis status (for polling)
export const getAnalysisStatus = asyncHandler(async (req, res) => {
  const contract = await Contract.findOne({
    _id: req.params.id,
    user: req.user.id
  }).select('status analysis analyzedAt');

  if (!contract) {
    return res.status(404).json({
      success: false,
      message: 'Contract not found'
    });
  }

  res.json({
    success: true,
    status: contract.status,
    analysis: contract.analysis,
    analyzedAt: contract.analyzedAt
  });
});
