import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate an embedding for a given text using OpenAI's text-embedding-3-small model
 * @param {string} text - The text to embed
 * @returns {Promise<number[]>} - Array of 1536 floats representing the embedding
 */
export async function generateEmbedding(text) {
  try {
    if (!text || typeof text !== "string") {
      throw new Error("Text must be a non-empty string");
    }

    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
      encoding_format: "float",
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error(`Failed to generate embedding: ${error.message}`);
  }
}

/**
 * Run a vector search on MongoDB Atlas Vector Search index
 * Retrieves top K semantically similar vault entries for a wallet
 * @param {Object} collection - MongoDB collection instance
 * @param {number[]} queryEmbedding - Embedding vector to search for
 * @param {string} wallet - User wallet address to filter by
 * @param {number} k - Number of results to return (default 5)
 * @returns {Promise<Array>} - Array of similar vault entries
 */
export async function vectorSearch(collection, queryEmbedding, wallet, k = 5) {
  try {
    const results = await collection
      .aggregate([
        {
          $search: {
            cosmosSearch: {
              vector: queryEmbedding,
              k: k,
            },
            returnStoredSource: true,
          },
        },
        {
          $match: {
            wallet: wallet.toLowerCase(),
          },
        },
        {
          $project: {
            _id: 1,
            wallet: 1,
            vaultData: 1,
            createdAt: 1,
            similarityScore: { $meta: "searchScore" },
          },
        },
        {
          $limit: k,
        },
      ])
      .toArray();

    return results;
  } catch (error) {
    console.error("Error performing vector search:", error);
    throw error;
  }
}

/**
 * Fallback: Get most recent vault entries (used if no embeddings exist)
 * @param {Object} collection - MongoDB collection instance
 * @param {string} wallet - User wallet address
 * @param {number} limit - Number of entries to return (default 5)
 * @returns {Promise<Array>} - Array of recent vault entries
 */
export async function getRecentVaultEntries(collection, wallet, limit = 5) {
  try {
    const results = await collection
      .find({ wallet: wallet.toLowerCase() })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return results;
  } catch (error) {
    console.error("Error fetching recent vault entries:", error);
    throw error;
  }
}
