import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

export function encryptData(data) {
  if (!SECRET_KEY) throw new Error("Encryption key is not set.");
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
}

export function decryptData(ciphertext) {
  if (!SECRET_KEY) throw new Error("Encryption key is not set.");
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}