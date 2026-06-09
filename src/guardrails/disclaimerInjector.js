const DISCLAIMER =
  "\n\n---\n *Disclaimer: This is not financial advice. Please consult a mortgage professional before making any financial decisions.*";

const LEGAL_KEYWORDS = [
  "rate",
  "interest",
  "payment",
  "qualify",
  "eligibility",
  "income",
  "debt",
  "credit",
  "down payment",
  "amortization",
  "stress test",
  "refinance",
  "equity",
  "penalty",
  "renewal",
];

// injecting disclaimer to response which contains financial topics
export function injectDisclaimer(responseText) {
  const lowered = responseText.toLowerCase();

  const containsFinancialContent = LEGAL_KEYWORDS.some((keyword) =>
    lowered.includes(keyword),
  );

  if (containsFinancialContent) {
    return {
      injected: true,
      disclaimer: DISCLAIMER,
      response: responseText + DISCLAIMER,
    };
  }

  return {
    injected: false,
    disclaimer: null,
    response: responseText,
  };
}
