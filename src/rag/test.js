import { retrieve } from "./retriever.js";
import { detectPII } from "../guardrails/piiDetector.js";
import { filterTopic } from "../guardrails/topicFilter.js";
import { injectDisclaimer } from "../guardrails/disclaimerInjector.js";
import { checkEscalation } from "../guardrails/escalationTrigger.js";
import { checkGrounding } from "../guardrails/groundingCheck.js";

const results = retrieve("what are the interest rated for a fixed mortgage");
console.log(JSON.stringify(results, null, 2));

const result = detectPII(
  "My SIN is 123-345-456 and my email is text@example.com",
);
console.log(JSON.stringify(result, null, 2));

console.log(filterTopic("What are the fixed mortgage rates?"));
console.log(filterTopic("What is the weather in Toronto?"));
console.log(filterTopic("Can I qualify for a first time buyer program?"));

console.log(
  injectDisclaimer(
    "The current 5-year fixed rate is 5.49% with a minimum down payment of 5%.",
  ),
);

console.log(injectDisclaimer("Hello! How can I help you today?"));

console.log(
  checkEscalation(
    "I'm going through a divorce and can't make my payments",
    "Here are your options for mortgage deferral...",
  ),
);

console.log(
  checkEscalation(
    "What are the current fixed rates?",
    "The current 5-year fixed rate is 5.49%",
  ),
);

const chunks = [
  {
    sectionTitle: "Fixed Rate Mortgages",
    content:
      "Fixed rate mortgages are available in 1, 2, 3, 5, and 10 year terms. The current 5-year fixed rate is 5.49%.",
  },
];

// Well grounded response
console.log(
  checkGrounding(
    "The current 5-year fixed rate is 5.49% and terms are available from 1 to 10 years.",
    chunks,
  ),
);

// Hallucinated response
console.log(
  checkGrounding(
    "The current 5-year fixed rate is 3.2% and you can get a 40-year amortization with no stress test.",
    chunks,
  ),
);
