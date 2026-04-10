import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

let cachedClient = null;
async function getClient() {
  if (!cachedClient) {
    cachedClient = new MongoClient(process.env.MONGODB_URI);
    await cachedClient.connect();
  }
  return cachedClient;
}

export async function POST(req) {
  try {
    const { wallet, vaultData } = await req.json();
    if (!wallet || !vaultData?.trim())
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });

    const client = await getClient();
    const collection = client.db("mindvaultDB").collection("vaults");

    const result = await collection.insertOne({
      wallet: wallet.toLowerCase(), // normalize so get/save always match
      vaultData: vaultData.trim(),
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}