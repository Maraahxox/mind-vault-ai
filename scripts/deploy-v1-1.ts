import "dotenv/config";
import { ethers } from "ethers";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  if (!process.env.SEPOLIA_RPC_URL || !process.env.SEPOLIA_PRIVATE_KEY) {
    throw new Error("Missing SEPOLIA_RPC_URL or SEPOLIA_PRIVATE_KEY in .env");
  }

  console.log("🚀 Deploying SoulboundNFT_v1_1 contract...");

  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const signer = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY!, provider);

  // Enhanced contract parameters
  const maxSupply = 10000; // Maximum supply
  const baseURI = "https://mindvault.app/metadata/"; // Base URI for metadata
  const initialOwner = signer.address; // Contract owner

  // Load contract artifact
  const artifactPath = join(__dirname, "../artifacts/contracts/SoulboundNFT_v1_1.sol/SoulboundNFT_v1_1.json");
  const SoulboundNFTArtifact = JSON.parse(readFileSync(artifactPath, "utf-8"));

  // Deploy the contract
  const SoulboundNFTFactory = new ethers.ContractFactory(
    SoulboundNFTArtifact.abi,
    SoulboundNFTArtifact.bytecode,
    signer
  );

  const soulboundNFT = await SoulboundNFTFactory.deploy(maxSupply, baseURI, initialOwner);

  await soulboundNFT.waitForDeployment();
  const address = await soulboundNFT.getAddress();

  console.log(`✅ SoulboundNFT_v1_1 deployed at: ${address}`);
  console.log(`📊 Max Supply: ${maxSupply}`);
  console.log(`🌐 Base URI: ${baseURI}`);
  console.log(`👤 Owner: ${initialOwner}`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
