import { isAddress } from "ethers";

export function validateWallet(wallet) {
  return isAddress(wallet);
}

export function validateVaultData(data) {
  if (typeof data !== "string") return false;
  if (data.trim().length === 0) return false;
  if (data.length > 10000) return false; // Max 10KB per entry
  return true;
}

export function validateSignature(signature) {
  if (typeof signature !== "string") return false;
  if (!signature.startsWith("0x")) return false;
  if (signature.length !== 132) return false; // 0x + 130 hex chars
  return true;
}

export function validateResponse(response) {
  return typeof response === "object" && response !== null;
}