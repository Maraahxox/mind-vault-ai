import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { ethers } from "ethers";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function GET(req,  { params }) {
  try {
    const tokenId = params.id;

    if (!tokenId) {
      return NextResponse.json(
        { error: "Token ID is required" },
        { status: 400 }
      );
    }

    let wallet = null;
    const contractAddress = process.env.SEPOLIA_CONTRACT_ADDRESS;
    if (contractAddress && contractAddress !== '') {
      try {
        // Query the blockchain for owner
        const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
        const contractABI = [
          "function ownerOf(uint256 tokenId) view returns (address)"
        ];
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        wallet = await contract.ownerOf(tokenId);
      } catch (error) {
        // Token not minted or burned, return error
        return NextResponse.json(
          { error: "Token not minted or does not exist" },
          { status: 404 }
        );
      }
    } else {
      // For local testing, use dummy wallet for each tokenId
      wallet = `0xDummyWalletForToken${tokenId}`;
    }

    // Fetch vault data for the wallet
    let vault = null;
    try {
      const db = client.db("mindvaultDB");
      const collection = db.collection("vaults");
      vault = await collection.findOne({ wallet });
    } catch (dbError) {
      console.warn("Database connection failed, using default attributes:", dbError.message);
    }

    let experienceLevel = 1;
    let memoryCapacity = "128 MB";
    let traits = {};

    if (vault && vault.vaultData) {
      // Assume vaultData has some structure
      // For example, if vaultData is an object with level, traits, etc.
      experienceLevel = vault.vaultData.experienceLevel || calculateLevel(vault);
      memoryCapacity = vault.vaultData.memoryCapacity || calculateCapacity(vault);
      traits = vault.vaultData.traits || {};
    }
     
    // Dynamic metadata generated per request
// Enables evolving NFTs without reminting
    const metadata = {
      name: `MindVault Soulbound #${tokenId}`,
      description: "Your eternal AI identity stored inside MindVault.",
      image: `https://mindvault.app/images/${tokenId}.png`,
      external_url: `https://mindvault.app/vault/${tokenId}`,
      attributes: [
        { trait_type: "AI Level", value: experienceLevel },
        { trait_type: "Memory Capacity", value: memoryCapacity },
        { trait_type: "Soulbound", value: "True" },
        ...(Object.entries(traits).map(([key, value]) => ({ trait_type: key, value })))
      ]
    };

    return new Response(JSON.stringify(metadata), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json(
      { error: "Error generating metadata", details: error.message },
      { status: 500 }
    );
  }
}

// Helper functions for calculation if no exact fields
// Level increases based on time and vault activity
// This is a deterministic placeholder for future AI-driven progression
function calculateLevel(vault) {
  // Simple calculation, e.g., based on age or number of data entries
  const age = Date.now() - new Date(vault.createdAt).getTime();
  const days = age / (1000 * 60 * 60 * 24);
  return Math.floor(days / 10) + 1; // Level increases every 10 days
}

// Memory capacity is currently derived from stored vault data size
// This will later be influenced by AI inference and user behavior
function calculateCapacity(vault) {
  // Example: base on data size or number
  const dataSize = JSON.stringify(vault.vaultData).length;
  const gb = (dataSize / 1024 / 1024).toFixed(2);
  return `${gb} GB`;
}
