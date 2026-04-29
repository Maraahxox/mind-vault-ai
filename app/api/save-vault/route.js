import { NextResponse } from "next/server";
import { encryptData } from "@/lib/encryption";
import { rateLimit } from "@/lib/rateLimit";
import { validateWallet, validateVaultData } from "@/lib/validation";
import clientPromise from "@/lib/mongodb";
import { generateEmbedding } from "@/lib/embeddings";

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
    const { wallet, vaultData } = await req.json();

    // Input validation
    if (!wallet || !validateWallet(wallet)) {
      return NextResponse.json(
        { success: false, error: "Invalid wallet address" },
        { status: 400 }
      );
    }

    if (!vaultData || !validateVaultData(vaultData)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing vault data" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const collection = client.db("mindvaultDB").collection("vaults");

    const encryptedData = encryptData(vaultData);

    // Generate embedding for vector search (RAG)
    let embedding = null;
    try {
      embedding = await generateEmbedding(vaultData);
    } catch (embeddingError) {
      console.warn("Failed to generate embedding, continuing without it:", embeddingError.message);
      // Continue saving without embedding - it's optional for compatibility
    }

    const documentToInsert = {
      wallet: wallet.toLowerCase(),
      vaultData: encryptedData,
      createdAt: new Date(),
    };

    // Add embedding if successfully generated
    if (embedding) {
      documentToInsert.embedding = embedding;
    }

    const result = await collection.insertOne(documentToInsert);

    return NextResponse.json(
      {
        success: true,
        message: "Vault data saved successfully",
        id: result.insertedId,
        embeddingStored: !!embedding,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving vault:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save vault data" },
      { status: 500 }
    );
  }
}