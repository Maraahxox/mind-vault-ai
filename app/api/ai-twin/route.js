import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { rateLimit } from "@/lib/rateLimit";
import { validateWallet } from "@/lib/validation";
import { generateEmbedding, vectorSearch, getRecentVaultEntries } from "@/lib/embeddings";
import { generateRAGResponse } from "@/lib/aiTwin";
import { decryptData } from "@/lib/encryption";
import { DEMO_WALLET, demoAIResponses } from "@/lib/demoData";

export async function POST(req) {
  // Rate limiting
  const rateLimitResult = rateLimit(req);
  if (rateLimitResult.isRateLimited) {
    return NextResponse.json(
      {
        success: false,
        message: "Too many requests. Please try again later.",
        resetTime: rateLimitResult.resetTime,
      },
      { status: 429 }
    );
  }

  try {
    const { wallet, message } = await req.json();

    // Input validation
    if (!wallet || !validateWallet(wallet)) {
      return NextResponse.json(
        { success: false, error: "Invalid wallet address" },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Message is required and must be non-empty" },
        { status: 400 }
      );
    }

    // Demo mode: return pre-generated response
    if (wallet.toLowerCase() === DEMO_WALLET.toLowerCase()) {
      const demoResponse = demoAIResponses[message] || demoAIResponses["default"] || "That's an interesting thought. Let me think about that from your perspective...";
      return NextResponse.json(
        {
          success: true,
          message: "AI response generated successfully (demo mode)",
          response: demoResponse,
          entriesUsed: 5,
          searchMethod: "demo_mode",
        },
        { status: 200 }
      );
    }

    const client = await clientPromise;
    const db = client.db("mindvaultDB");
    const collection = db.collection("vaults");

    let contextEntries = [];
    let usingVectorSearch = false;

    try {
      // Step 1: Generate embedding for user's message
      const messageEmbedding = await generateEmbedding(message);

      // Step 2: Try vector search first
      try {
        contextEntries = await vectorSearch(collection, messageEmbedding, wallet, 5);
        usingVectorSearch = true;
        console.log(`Found ${contextEntries.length} entries via vector search`);
      } catch (vectorSearchError) {
        console.warn("Vector search failed, falling back to chronological retrieval:", vectorSearchError.message);
        // Fallback to most recent entries
        contextEntries = await getRecentVaultEntries(collection, wallet, 5);
      }
    } catch (embeddingError) {
      console.warn("Embedding generation failed, using chronological retrieval:", embeddingError.message);
      // Fallback to most recent entries if embedding fails
      contextEntries = await getRecentVaultEntries(collection, wallet, 5);
    }

    if (contextEntries.length === 0) {
      return NextResponse.json(
        { success: false, error: "No vault data found for this wallet" },
        { status: 404 }
      );
    }

    // Step 3: Decrypt vault data for context (only decrypt vaultData field)
    const decryptedContext = contextEntries.map((entry) => {
      try {
        return {
          ...entry,
          vaultData: decryptData(entry.vaultData),
        };
      } catch (decryptError) {
        console.warn("Could not decrypt entry, using encrypted data:", decryptError.message);
        return entry;
      }
    });

    // Step 4: Generate AI response using RAG
    const aiResponse = await generateRAGResponse(message, decryptedContext);

    // Step 5: Increment analytics counter
    try {
      const statsCollection = db.collection("stats");
      await statsCollection.updateOne(
        { _id: "platform_stats" },
        { $inc: { aiTwinQueries: 1 } },
        { upsert: true }
      );
    } catch (statsError) {
      console.warn("Failed to increment analytics counter:", statsError.message);
      // Don't fail the request if analytics fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "AI response generated successfully",
        response: aiResponse,
        entriesUsed: contextEntries.length,
        searchMethod: usingVectorSearch ? "vector_search" : "chronological",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in AI Twin API:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate AI response" },
      { status: 500 }
    );
  }
}