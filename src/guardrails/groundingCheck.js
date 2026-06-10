// tokenize into meaningful words, filter out stop words.

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "shall",
  "can",
  "need",
  "to",
  "of",
  "in",
  "for",
  "on",
  "with",
  "at",
  "by",
  "from",
  "up",
  "about",
  "into",
  "through",
  "and",
  "or",
  "but",
  "if",
  "as",
  "it",
  "its",
  "this",
  "that",
  "these",
  "those",
  "i",
  "you",
  "he",
  "she",
  "we",
  "they",
  "what",
  "which",
  "who",
  "not",
  "no",
  "so",
  "than",
  "then",
  "when",
  "where",
  "how",
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

// checks for hallucination in LLM response
export function checkGrounding(responseText, retreivedChunks) {
  //building corpus of all words from retreived chunks
  const sourceText = retreivedChunks
    .map((chunk) => `${chunk.sectionTitle} ${chunk.content}`)
    .join(" ");
  const sourceTokens = new Set(tokenize(sourceText));
  const responseTokens = tokenize(responseText);

  if (responseTokens.length === 0) {
    return {
      isGrounded: true,
      coverageScore: 1,
      unmatchedTerms: [],
      warning: null,
    };
  }

  // find meaningful terms in response that are not present in sources
  const unmatchedTerms = responseTokens.filter(
    (token) => !sourceTokens.has(token),
  );

  // coverage score is percentage of response tokens found in sources
  const coverageScore = parseFloat(
    (
      (responseTokens.length - unmatchedTerms.length) /
      responseTokens.length
    ).toFixed(2),
  );

  //  flag if coveragescore is less than 60%
  const isGrounded = coverageScore >= 0.6;

  return {
    isGrounded,
    coverageScore,
    unmatchedTerms: [...new Set(unmatchedTerms)],
    warning: isGrounded
      ? null
      : `Response may contain information not found in source documents (coverage: ${Math.round(coverageScore * 100)}%)`,
  };
}
