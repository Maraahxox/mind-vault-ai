import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { encryptData } from "@/lib/encryption";
import { rateLimit } from "@/lib/rateLimit";
import { validateWallet, validateVaultData } from "@/lib/validation";

let cachedClient = null;
async function getClient() {
  if (!cachedClient) {
    cachedClient = new MongoClient(process.env.MONGODB_URI);
    await cachedClient.connect();
  }
  return cachedClient;
}

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

    const client = await getClient();
    const collection = client.db("mindvaultDB").collection("vaults");

    const encryptedData = encryptData(vaultData);

    const result = await collection.insertOne({
      wallet: wallet.toLowerCase(),
      vaultData: encryptedData,
      createdAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Vault data saved successfully",
        id: result.insertedId,
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