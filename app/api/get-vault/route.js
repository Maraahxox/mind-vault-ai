import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// Cached connection — critical for Next.js serverless
let cachedClient = null;
async function getClient() {
  if (!cachedClient) {
    cachedClient = new MongoClient(process.env.MONGODB_URI);
    await cachedClient.connect();
  }
  return cachedClient;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const wallet = searchParams.get("wallet")?.toLowerCase();
    if (!wallet) return NextResponse.json({ success: false, message: "Wallet required" }, { status: 400 });

    const client = await getClient();
    const collection = client.db("mindvaultDB").collection("vaults");

    // find ALL entries for this wallet, newest first
    const vault = await collection
      .find({ wallet })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json({ success: true, vault });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}