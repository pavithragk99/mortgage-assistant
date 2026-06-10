const MORTGAGE_KEYWORDS = [
  "mortgage",
  "loan",
  "lender",
  "borrower",
  "lending", // Core mortgage terms
  "rate",
  "interest",
  "fixed",
  "variable",
  "prime", // Rates
  "qualify",
  "qualification",
  "eligible",
  "eligibility",
  "credit",
  "score",
  "income",
  "debt",
  "gds",
  "tds",
  "stress test", // Eligibility
  "payment",
  "down payment",
  "deposit",
  "amortization",
  "term", // Payment
  "monthly",
  "prepayment",
  "penalty",
  "property",
  "home",
  "house",
  "condo",
  "townhouse",
  "purchase", // Property
  "refinance",
  "renewal",
  "equity",
  "cmhc",
  "fhsa",
  "rrsp",
  "hbp",
  "sin",
  "first time buyer", // Canadian specific
  "land transfer",
  "closing costs",
  "insured",
  "uninsured",
];

const OFF_TOPIC_RESPONSES = [
  "I'm only able to help with mortgage-related questions. Try asking about rates, eligibility, or first-time buyer programs.",
  "That's outside my area of expertise. I'm here to help with mortgage questions — feel free to ask about rates, terms, or eligibility.",
  "I specialize in mortgage assistance only. I'd be happy to help with questions about home financing, rates, or buyer programs.",
];

// Checks if message is mortgage related and returns { isOnTopic, matchedKeywords, offTopicResponse}
export function filterTopic(text) {
  const lowered = text.toLowerCase();

  const matchedKeywords = MORTGAGE_KEYWORDS.filter((keyword) =>
    lowered.includes(keyword),
  );

  const isOnTopic = matchedKeywords.length > 0;

  if (!isOnTopic) {
    return {
      isOnTopic: false,
      matchedKeywords: [],
      offTopicResponse:
        OFF_TOPIC_RESPONSES[
          Math.floor(Math.random() * OFF_TOPIC_RESPONSES.length)
        ],
    };
  }

  return {
    isOnTopic: true,
    matchedKeywords,
  };
}
