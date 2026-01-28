import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function GET(req) {
  try {
    // Extract wallet address from the query string
    const { searchParams } = new URL(req.url);
    const wallet = searchParams.get("wallet");

    if (!wallet) {
      return NextResponse.json(
        { success: false, message: "Wallet address is required" },
        { status: 400 }
      );
    }

    const db = client.db("mindvaultDB");
    const collection = db.collection("vaults");

    // Find the vault by wallet
    const vault = await collection.findOne({ wallet });

    if (!vault) {
      return NextResponse.json(
        { success: false, message: "Vault not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, vault });
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching vault", error: error.message },
      { status: 500 }
    );
  }
}
