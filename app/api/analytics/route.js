import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { demoAnalytics } from "@/lib/demoData";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("mindvaultDB");

    // Get wallet count
    const walletsCollection = db.collection("wallets");
    const walletsConnected = await walletsCollection.countDocuments();

    // Get vault entries count
    const vaultsCollection = db.collection("vaults");
    const memoriesStored = await vaultsCollection.countDocuments();

    // Get AI Twin queries count
    const statsCollection = db.collection("stats");
    const statsDoc = await statsCollection.findOne({ _id: "platform_stats" });
    const aiTwinQueries = statsDoc?.aiTwinQueries || 0;

    // Get NFT minted count (from contract if available)
    // For now, approximate based on wallets with vaults
    const soulboundNFTsMinted = walletsConnected;

    return NextResponse.json(
      {
        success: true,
        walletsConnected,
        memoriesStored,
        aiTwinQueries,
        soulboundNFTsMinted,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch analytics, returning demo data:", error.message);
    // Return demo analytics on error (graceful fallback)
    return NextResponse.json(
      {
        success: true,
        walletsConnected: demoAnalytics.walletsConnected,
        memoriesStored: demoAnalytics.memoriesStored,
        aiTwinQueries: demoAnalytics.aiTwinQueries,
        soulboundNFTsMinted: demoAnalytics.soulboundNFTsMinted,
        timestamp: new Date().toISOString(),
        note: "Using demo data due to database unavailability",
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=5",
        },
      }
    );
  }
}
