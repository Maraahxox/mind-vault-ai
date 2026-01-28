import "dotenv/config";
import { ethers } from "ethers";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const contractAddress = "0x071e36df9cD6293e69F8bB19be17557c00839E32";

  // Set up provider and signer like in deploy script
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const signer = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);

  console.log("Minting from:", signer.address);

  // Load artifact
  const artifactPath = join(__dirname, "../artifacts/contracts/SoulboundNFT_v1_1.sol/SoulboundNFT_v1_1.json");
  const artifact = JSON.parse(readFileSync(artifactPath, "utf-8"));

  const SoulboundNFT = new ethers.Contract(contractAddress, artifact.abi, signer);

  // Mint SBT
  const tx = await SoulboundNFT.mintSoulbound();
  console.log("Transaction sent:", tx.hash);

  const receipt = await tx.wait();
  console.log("Minted! Tx mined in block:", receipt.blockNumber);

  // Get the new token ID
  const totalSupply = await SoulboundNFT.totalSupply();
  console.log("Your test token ID is:", totalSupply.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
