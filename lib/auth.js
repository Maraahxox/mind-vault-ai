import { verifyMessage } from "ethers";

export function verifyWalletSignature(message, signature, wallet) {
  try {
    const recoveredAddress = verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === wallet.toLowerCase();
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

export function generateAuthMessage(wallet, nonce) {
  return `Sign this message to authenticate with Mind Vault:\n\nWallet: ${wallet}\nNonce: ${nonce}\nTimestamp: ${Date.now()}`;
}