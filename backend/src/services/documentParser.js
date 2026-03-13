import fs from 'fs/promises';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * Extract text from PDF, DOCX, or DOC files
 * @param {string} filePath - Path to the file
 * @param {string} fileType - File extension (pdf, docx, doc)
 * @returns {Promise<{text: string, pages: number}>}
 */
export async function extractText(filePath, fileType) {
  try {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return await extractFromPDF(filePath);
      case 'docx':
        return await extractFromDOCX(filePath);
      case 'doc':
        return await extractFromDOC(filePath);
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    console.error('Error extracting text:', error);
    throw new Error(`Failed to extract text from ${fileType} file: ${error.message}`);
  }
}

async function extractFromPDF(filePath) {
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdfParse(dataBuffer);
  
  return {
    text: cleanText(data.text),
    pages: data.numpages || 1
  };
}

async function extractFromDOCX(filePath) {
  const dataBuffer = await fs.readFile(filePath);
  const result = await mammoth.extractRawText({ buffer: dataBuffer });
  
  return {
    text: cleanText(result.value),
    pages: estimatePages(result.value)
  };
}

async function extractFromDOC(filePath) {
  // For older .doc files, mammoth might not work well
  // Try mammoth first, fallback to basic extraction
  try {
    const dataBuffer = await fs.readFile(filePath);
    const result = await mammoth.extractRawText({ buffer: dataBuffer });
    
    return {
      text: cleanText(result.value),
      pages: estimatePages(result.value)
    };
  } catch (error) {
    console.warn('DOC extraction with mammoth failed:', error.message);
    throw new Error('DOC format not fully supported. Please convert to PDF or DOCX.');
  }
}

function cleanText(text) {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function estimatePages(text) {
  // Rough estimate: ~3000 characters per page
  const charsPerPage = 3000;
  return Math.max(1, Math.ceil(text.length / charsPerPage));
}
