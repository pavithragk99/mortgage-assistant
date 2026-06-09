import { retrieve } from "./retriever.js";
import { detectPII } from "../guardrails/piiDetector.js";
import { filterTopic } from "../guardrails/topicFilter.js";
import { injectDisclaimer } from "../guardrails/disclaimerInjector.js";

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
