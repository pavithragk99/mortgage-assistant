//Builds system prompt with retrived context injected.
export function buildPrompt(retrievedChunks) {
  const contextBlock = retrievedChunks
    .map(
      (chunk, i) =>
        "[Source ${i + 1}: ${chunk.docTitle} - ${chunk.sectionTitle}]\n${chunk.content}",
    )
    .join("\n\n");

  return `You are a helpful mortgage assistant for a Canadian lending institution.
Answer questions using ONLY the information provided in the sources below.
If the answer is not found in the sources, say "I don't have information on that in our current documentation."
Do not make up rates, numbers, or policies.

--- SOURCES ---
${contextBlock}
--- END SOURCES ---

Always be clear, concise, and professional.`;
}

// Build the messages array for Claude API call
export function buildMessages(conversationHistory, userMessage) {
  return [...conversationHistory, { role: "user", content: userMessage }];
}
