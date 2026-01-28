import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("SoulboundNFT_v1_1Module", (m) => {
  // Parameters for the enhanced contract
  const maxSupply = m.getParameter("maxSupply", 10000); // Default max supply
  const baseURI = m.getParameter("baseURI", "https://mindvault.app/metadata/"); // Default base URI
  const initialOwner = m.getParameter("initialOwner", m.getAccount(0)); // Deployer as owner

  const soulboundNFT = m.contract("SoulboundNFT_v1_1", [maxSupply, baseURI, initialOwner]);

  return { soulboundNFT };
});
