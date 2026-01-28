import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { wallet } = await req.json();

    if (!wallet) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("mind-vault");

    // Save wallet (unique per user)
    const result = await db.collection("wallets").updateOne(
      { wallet }, // find by wallet
      { $set: { wallet, connectedAt: new Date() } }, // update or insert
      { upsert: true }
    );

    return NextResponse.json({ success: true, wallet });
  } catch (error) {
    console.error("Error saving wallet:", error);
    return NextResponse.json({ error: "Failed to save wallet" }, { status: 500 });
  }
}
