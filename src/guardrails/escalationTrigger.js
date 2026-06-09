const ESCALATION_PATTERNS = [
  // Financial distress
  "losing my home",
  "lose my home",
  "foreclosure",
  "power of sale",
  "cant make payments",
  "can't make payments",
  "missing payments",
  "missed payments",
  "behind on payments",
  "default",
  "defaulting",

  // Life events
  "divorce",
  "separation",
  "death",
  "deceased",
  "estate",
  "bankruptcy",
  "bankrupt",
  "insolvency",

  // Urgency signals
  "urgent",
  "emergency",
  "immediately",
  "eviction",
  "evicted",
  "losing everything",
];

const ESCALATION_MESSAGE =
  " **Speak to a Mortgage Advisor** This sounds like a situation where personalized guidance would be valuable. One of our licensed mortgage advisors can help you navigate your options. Please call **1-800-888-8888** or [book an appointment online](#).";

// checks if user message and LLM response contains escalation signals
export function checkEscalation(userMessage, responseText) {
  const combined = `${userMessage} ${responseText}`.toLowerCase();

  const triggeredPatterns = ESCALATION_PATTERNS.filter((pattern) =>
    combined.includes(pattern),
  );

  const shouldEscalate = triggeredPatterns.length > 0;

  if (shouldEscalate) {
    return {
      shouldEscalate: true,
      patterns: triggeredPatterns,
      escalationMessage: ESCALATION_MESSAGE,
    };
  }

  return {
    shouldEscalate: false,
    patterns: [],
  };
}
