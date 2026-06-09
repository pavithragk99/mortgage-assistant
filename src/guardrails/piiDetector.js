const PII_PATTERNS = [
  {
    name: "Credit Card Number",
    regex: /\b(?:\d{4}[\s-]?){3}\d{4}\b/g,
  },
  {
    name: "Social Insurance Number (SIN)",
    regex: /\b\d{3}[-\s]?\d{3}[-\s]?\d{3}\b/g,
  },
  {
    name: "Email Address",
    regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  },
  {
    name: "Phone Number",
    regex: /\b(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
  },
];

// Scanning input for PII patterns
export function detectPII(text) {
  const detectedTypes = [];

  for (const pattern of PII_PATTERNS) {
    pattern.regex.lastIndex = 0;
    if (pattern.regex.test(text)) {
      detectedTypes.push(pattern.name);
    }
  }

  const hasPII = detectedTypes.length > 0;

  // Sanitize and replace PII with placeholders
  let sanitized = text;
  for (const pattern of PII_PATTERNS) {
    pattern.regex.lastIndex = 0;
    sanitized = sanitized.replace(pattern.regex, "[REDACTED]");
  }

  return {
    hasPII,
    detectedTypes,
    sanitized,
  };
}
