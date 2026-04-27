import { NextResponse } from "next/server";
import { generateResponse } from "@/lib/aiTwin";
import clientPromise from "@/lib/mongodb";
import { rateLimit } from "@/lib/rateLimit";
import { validateWallet } from "@/lib/validation";

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
    const { wallet } = await req.json();

    // Input validation
    if (!wallet || !validateWallet(wallet)) {
      return NextResponse.json(
        { success: false, error: "Invalid wallet address" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("mindvaultDB");
    const collection = db.collection("vaults");

    // Fetch user vault entries
    const entries = await collection
      .find({ wallet: wallet.toLowerCase() })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    if (entries.length === 0) {
      return NextResponse.json(
        { success: false, error: "No vault data found for this wallet" },
        { status: 404 }
      );
    }

    const userVaultEntries = entries.map((entry) => entry.vaultData);

    // Generate AI response
    const aiResponse = await generateResponse(userVaultEntries);

    return NextResponse.json(
      {
        success: true,
        message: "AI response generated successfully",
        response: aiResponse,
        entriesUsed: entries.length,
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