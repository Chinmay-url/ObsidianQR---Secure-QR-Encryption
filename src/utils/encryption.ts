import CryptoJS from 'crypto-js';

export const generateSecretKey = (): string => {
  // 32 bytes → 64 hex chars (same as Android)
  return CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
};

export const encryptMessage = (message: string, secretKeyHex: string): string => {
  const key = CryptoJS.enc.Hex.parse(secretKeyHex);

  const encrypted = CryptoJS.AES.encrypt(message, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });

  // Base64 ciphertext, no "Salted__"
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
};

export const decryptMessage = (cipherTextBase64: string, secretKeyHex: string): string => {
  try {
    const key = CryptoJS.enc.Hex.parse(secretKeyHex);

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: CryptoJS.enc.Base64.parse(cipherTextBase64) } as any,
      key,
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    const plainText = decrypted.toString(CryptoJS.enc.Utf8);
    if (!plainText) throw new Error('Decryption failed');
    return plainText;
  } catch {
    throw new Error('Invalid secret key or corrupted data');
  }
};