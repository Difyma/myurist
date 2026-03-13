/**
 * Extract clause/paragraph references from contract text
 * @param {string} text - Contract text
 * @returns {Array<{number: string, text: string}>} Array of clauses with numbers
 */
export function extractClauses(text) {
  const clauses = [];
  
  // Common Russian clause patterns
  const patterns = [
    // "1." or "1.1." or "1.1.1." followed by text
    /^(\d+(?:\.\d+)+)\.?\s*(.+)$/gm,
    // "Статья 1." or "Статья 1" followed by text
    /^(?:Статья|статья)\s+(\d+)\.?\s*(.+)$/gim,
    // "Пункт 1." or "Пункт 1" followed by text
    /^(?:Пункт|пункт)\s+(\d+(?:\.\d+)*)\.?\s*(.+)$/gim,
    // "Раздел 1." or "Раздел 1" followed by text
    /^(?:Раздел|раздел)\s+(\d+)\.?\s*(.+)$/gim
  ];

  // Extract numbered clauses
  const lines = text.split('\n');
  let currentClause = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Try to match clause patterns
    let matched = false;
    
    // Pattern 1: Numbered clauses (1., 1.1., 1.1.1., etc.)
    const numMatch = line.match(/^(\d+(?:\.\d+)*)\.?\s*(.+)$/);
    if (numMatch) {
      const clauseNum = numMatch[1];
      const clauseText = numMatch[2].trim();
      
      // Only consider it a clause if it looks like one (reasonable length, starts with capital)
      if (clauseText.length > 10 && clauseText.length < 500) {
        clauses.push({
          number: clauseNum,
          text: clauseText,
          fullText: line
        });
        currentClause = clauses[clauses.length - 1];
        matched = true;
      }
    }
    
    // Pattern 2: "Статья X" format
    if (!matched) {
      const articleMatch = line.match(/^(?:Статья|статья)\s+(\d+)\.?\s*(.+)$/i);
      if (articleMatch) {
        clauses.push({
          number: `Статья ${articleMatch[1]}`,
          text: articleMatch[2].trim(),
          fullText: line
        });
        currentClause = clauses[clauses.length - 1];
        matched = true;
      }
    }
    
    // Pattern 3: "Пункт X" format
    if (!matched) {
      const pointMatch = line.match(/^(?:Пункт|пункт)\s+(\d+(?:\.\d+)*)\.?\s*(.+)$/i);
      if (pointMatch) {
        clauses.push({
          number: `Пункт ${pointMatch[1]}`,
          text: pointMatch[2].trim(),
          fullText: line
        });
        currentClause = clauses[clauses.length - 1];
        matched = true;
      }
    }

    // If no match and we have a current clause, append to it (multi-line clause)
    if (!matched && currentClause && line.length > 5 && !line.match(/^\d/)) {
      currentClause.text += ' ' + line;
      currentClause.fullText += '\n' + line;
    }
  }

  return clauses;
}

/**
 * Find the clause number that contains the given text
 * @param {Array} clauses - Array of extracted clauses
 * @param {string} searchText - Text to search for
 * @returns {string|null} Clause number or null
 */
export function findClauseForText(clauses, searchText) {
  if (!searchText || !clauses || clauses.length === 0) return null;
  
  const searchLower = searchText.toLowerCase().trim();
  
  // Try exact match first
  for (const clause of clauses) {
    if (clause.text.toLowerCase().includes(searchLower) || 
        searchLower.includes(clause.text.toLowerCase().slice(0, 50))) {
      return clause.number;
    }
  }
  
  // Try fuzzy match (first 30 chars)
  const searchSnippet = searchLower.slice(0, 30);
  for (const clause of clauses) {
    const clauseSnippet = clause.text.toLowerCase().slice(0, 30);
    if (clauseSnippet.includes(searchSnippet) || searchSnippet.includes(clauseSnippet)) {
      return clause.number;
    }
  }
  
  return null;
}

/**
 * Enhance risks with clause references
 * @param {Array} risks - Array of risk objects
 * @param {Array} clauses - Array of extracted clauses
 * @returns {Array} Risks with clause references added
 */
export function enhanceRisksWithClauses(risks, clauses) {
  if (!risks || !clauses) return risks;
  
  return risks.map(risk => {
    const enhancedRisk = { ...risk };
    
    // Try to find clause for the risk text
    if (risk.text) {
      const clauseRef = findClauseForText(clauses, risk.text);
      if (clauseRef) {
        enhancedRisk.clause = clauseRef;
      }
    }
    
    // Try to find clause for the title if no match for text
    if (!enhancedRisk.clause && risk.title) {
      const clauseRef = findClauseForText(clauses, risk.title);
      if (clauseRef) {
        enhancedRisk.clause = clauseRef;
      }
    }
    
    return enhancedRisk;
  });
}
