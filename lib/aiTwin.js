import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function generateResponse(userVaultEntries) {
  try {
    const prompt = `You are an AI Twin. Based on the following user data, generate a response that reflects the user's personality and knowledge:\n\n${userVaultEntries.join("\n\n")}`;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 150,
      temperature: 0.7,
    });

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw new Error("Failed to generate AI response.");
  }
}