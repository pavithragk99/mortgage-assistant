import { detectPII } from "./piiDetector.js";
import { filterTopic } from "./topicFilter.js";
import { injectDisclaimer } from "./disclaimerInjector.js";
import { checkEscalation } from "./escalationTrigger.js";
import { checkGrounding } from "./groundingCheck.js";

// run guardrails pipeline. inputGuardrails is run before LLM call and outputGuardrails is run after LLM call
export function runInputGuardrails(userMessage) {
  const piiResult = detectPII(userMessage); // PII detection
  const topicResult = filterTopic(piiResult.sanitized || userMessage); //Topic Filter

  return {
    processedMessage: piiResult.sanitized || userMessage, //passing to LLM after sanitization and validation
    layers: {
      pii: {
        passed: !piiResult.containsPII,
        containsPII: piiResult.containsPII,
        detectedTypes: piiResult.detectedTypes,
        sanitized: piiResult.sanitized,
      },
      topic: {
        passed: topicResult.isOnTopic,
        isOnTopic: topicResult.isOnTopic,
        matchedKeywords: topicResult.matchedKeywords,
        offTopicResponse: topicResult.offTopicResponse || null,
      },
    },

    //call LLM or not?
    proceedToLLM: topicResult.isOnTopic,

    //not calling LLM, display off topic response to user
    blockedResponse: !topicResult.isOnTopic
      ? topicResult.offTopicResponse
      : null,
  };
}

export function runOutputGuardrails(
  userMessage,
  responseText,
  retrievedChunks,
) {
  const disclaimerResult = injectDisclaimer(responseText);
  const escalationResult = checkEscalation(userMessage, responseText);
  const groundingResult = checkGrounding(responseText, retrievedChunks);

  let finalResponse = disclaimerResult.response; //using disclaimer added response as final response

  if (escalationResult.shouldEscalate) {
    finalResponse += `\n\n${escalationResult.escalationMessage}`; //adding escalation message to final response in case of escalation trigger
  }

  return {
    finalResponse,
    layers: {
      disclaimer: {
        passed: true, // always passes, just injects
        injected: disclaimerResult.injected,
      },
      escalation: {
        passed: !escalationResult.shouldEscalate,
        shouldEscalate: escalationResult.shouldEscalate,
        triggeredPatterns: escalationResult.triggeredPatterns,
      },
      grounding: {
        passed: groundingResult.isGrounded,
        coverageScore: groundingResult.coverageScore,
        unmatchedTerms: groundingResult.unmatchedTerms,
        warning: groundingResult.warning,
      },
    },
  };
}
