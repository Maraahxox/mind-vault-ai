import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { rateLimit } from "@/lib/rateLimit";
import { validateWallet } from "@/lib/validation";

// Prevent static generation - this route needs runtime environment variables
export const dynamic = 'force-dynamic';

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
    const db = client.db("mind-vault");

    // Save wallet (unique per user)
    const result = await db.collection("wallets").updateOne(
      { wallet: wallet.toLowerCase() },
      { $set: { wallet: wallet.toLowerCase(), connectedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Wallet connected successfully",
        wallet: wallet.toLowerCase(),
        upserted: result.upsertedCount > 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error connecting wallet:", error);
    return NextResponse.json(
      { success: false, error: "Failed to connect wallet" },
      { status: 500 }
    );
  }
}
