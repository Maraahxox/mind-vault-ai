import { config } from "dotenv";

config();

import { ethers } from "ethers";

import { readFileSync } from "fs";

import { fileURLToPath } from "url";

import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const artifactPath = join(__dirname, "../artifacts/contracts/SoulboundNFT.sol/SoulboundNFT.json");

const SoulboundNFTArtifact = JSON.parse(readFileSync(artifactPath, "utf-8"));

async function main() {
  if (!process.env.SEPOLIA_RPC_URL || !process.env.SEPOLIA_PRIVATE_KEY) {
    throw new Error("Missing SEPOLIA_RPC_URL or SEPOLIA_PRIVATE_KEY in .env");
  }

  console.log("🚀 Deploying SoulboundNFT contract...");

  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const signer = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY as string, provider);
  const SoulboundNFT = new ethers.ContractFactory(SoulboundNFTArtifact.abi, SoulboundNFTArtifact.bytecode, signer);
  const soulbound = await SoulboundNFT.deploy();

  await soulbound.waitForDeployment();
  const address = await soulbound.getAddress();

  console.log(`✅ SoulboundNFT deployed at: ${address}`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
