import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function POST(req) {
  try {
    const { wallet, vaultData } = await req.json();

    const db = client.db("mindvaultDB");
    const collection = db.collection("vaults");

    const result = await collection.insertOne({
      wallet: wallet || null,
      vaultData: vaultData || null,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json(
      { success: false, message: "Error saving vault", error: error.message },
      { status: 500 }
    );
  }
}
