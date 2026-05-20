// Lazy-load OpenAI to prevent build failures
let openai = null;

function getOpenAIClient() {
  if (!openai) {
    try {
      const OpenAI = require("openai").default;
      openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    } catch (error) {
      console.error("Failed to initialize OpenAI:", error.message);
      throw new Error("OpenAI client not available");
    }
  }
  return openai;
}

/**
 * Legacy function - kept for backward compatibility
 * Generates a response from vault entries without RAG (used only if needed)
 */
export async function generateResponse(userVaultEntries) {
  try {
    const openaiClient = getOpenAIClient();
    const prompt = `You are an AI Twin. Based on the following user data, generate a response that reflects the user's personality and knowledge:\n\n${userVaultEntries.join("\n\n")}`;

    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw new Error("Failed to generate AI response.");
  }
}

/**
 * Generate a RAG-enhanced response using semantic search context
 * This is the new primary method for AI Twin interaction
 * @param {string} userMessage - The user's message/query
 * @param {Array} contextEntries - Vault entries retrieved via vector search
 * @returns {Promise<string>} - AI-generated response in user's voice
 */
export async function generateRAGResponse(userMessage, contextEntries) {
  try {
    // Build context from the vault entries
    let contextText = "";
    if (contextEntries && contextEntries.length > 0) {
      contextText = contextEntries
        .map((entry, idx) => {
          let data = entry.vaultData;
          // Handle both encrypted and decrypted data
          if (typeof data === "object") {
            data = JSON.stringify(data);
          }
          return `[Memory ${idx + 1}]: ${data}`;
        })
        .join("\n\n");
    }

    // System prompt - makes AI Twin speak as the user
    const systemPrompt = `You are the AI Twin of this user. You speak in their voice, using their memories and thoughts as context. Respond naturally as if you are them, drawing from the memories provided. Be concise, authentic, and maintain their personality. If the memories don't directly address the topic, apply their general thinking style and values.`;

    // Construct the user message with context
    const userPrompt = contextText
      ? `Here are my recent memories:\n\n${contextText}\n\nNow, considering these memories: ${userMessage}`
      : userMessage;

    const response = await getOpenAIClient().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 300,
      temperature: 0.8, // Slightly higher for more personality
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating RAG response:", error);
    throw new Error(`Failed to generate AI response: ${error.message}`);
  }
}