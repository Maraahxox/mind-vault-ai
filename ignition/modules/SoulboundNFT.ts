import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("SoulboundNFTModule", (m) => {
  const soulbound = m.contract("SoulboundNFT");

  return { soulbound };
});
