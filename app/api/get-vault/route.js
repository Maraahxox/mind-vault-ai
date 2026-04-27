import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { decryptData } from "@/lib/encryption";
import { rateLimit } from "@/lib/rateLimit";
import { validateWallet } from "@/lib/validation";

let cachedClient = null;
async function getClient() {
  if (!cachedClient) {
    cachedClient = new MongoClient(process.env.MONGODB_URI);
    await cachedClient.connect();
  }
  return cachedClient;
}

export async function GET(req) {
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
    const { searchParams } = new URL(req.url);
    const wallet = searchParams.get("wallet")?.toLowerCase();

    // Input validation
    if (!wallet || !validateWallet(wallet)) {
      return NextResponse.json(
        { success: false, error: "Invalid wallet address" },
        { status: 400 }
      );
    }

    const client = await getClient();
    const collection = client.db("mindvaultDB").collection("vaults");

    const vault = await collection
      .find({ wallet })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    // Decrypt vault data before sending it to the client
    const decryptedVault = vault.map((entry) => ({
      ...entry,
      vaultData: decryptData(entry.vaultData),
    }));

    return NextResponse.json(
      {
        success: true,
        message: "Vault retrieved successfully",
        count: decryptedVault.length,
        vault: decryptedVault,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving vault:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve vault data" },
      { status: 500 }
    );
  }
}