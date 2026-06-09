import { documents } from "../data/documents.js";

/**
 * RETRIEVAL STRATEGY: TF-IDF keyword scoring
 *
 * Chosen for: simplicity, zero dependencies, full transparency
 * Tradeoff:   no semantic understanding (won't match "home loan" → "mortgage")
 * Upgrade path: replace scoreChunk() with cosine similarity on embeddings
 *               from OpenAI text-embedding-3-small or a local Ollama model.
 *               Interface stays identical — retrieve(query, topN) unchanged.
 */

// Tokenize a string into lower case words and remove punctuation
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

// Calculate TF-IDF score between user query and document chunk. (Term Frequency - Inverse Document Frequency) - Checks relevance of piece of document with search query.
// Not using real vector embeddings. Adds complexity. Can be added later for future.
function scoreChunk(queryTokens, chunkText) {
  const chunkTokens = tokenize(chunkText);
  const chunkFreq = {};

  for (const token of chunkTokens) {
    chunkFreq[token] = (chunkFreq[token] || 0) + 1;
  }

  let score = 0;
  for (const token of queryTokens) {
    if (chunkFreq[token]) {
      score += 1 + Math.log(chunkFreq[token]);
    }
  }

  return score / Math.sqrt(chunkTokens.length || 1); // Normalize by chunk length
}

// Retrive top N relevant chunks for query. Returns array of {docTitle, sectionTitle, content, score}
export function retrieve(query, topN = 3) {
  const queryTokens = tokenize(query);
  const results = [];

  for (const doc of documents) {
    for (const section of doc.sections) {
      const text = `${section.heading} ${section.content}`;
      const score = scoreChunk(queryTokens, text);

      results.push({
        docTitle: doc.title,
        docId: doc.id,
        sectionTitle: section.heading,
        sectionId: section.id,
        content: section.content,
        score,
      });
    }
  }

  // Sort by score and return top N (descending)
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .filter((r) => r.score > 0); // Filter out zero-score results
}
