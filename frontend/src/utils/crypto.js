import CryptoJS from 'crypto-js';

const ITERATIONS = 100000;
const KEY_SIZE = 256 / 32;

export const deriveKey = (masterPassword, salt) => {
  return CryptoJS.PBKDF2(masterPassword, salt, {
    keySize: KEY_SIZE,
    iterations: ITERATIONS,
  }).toString();
};

export const encrypt = (data, key) => {
  const salt = CryptoJS.lib.WordArray.random(128 / 8).toString();
  const iv = CryptoJS.lib.WordArray.random(128 / 8).toString();
  const derivedKey = deriveKey(key, salt);

  const encrypted = CryptoJS.AES.encrypt(data, derivedKey, {
    iv: CryptoJS.enc.Hex.parse(iv),
  }).toString();

  return {
    ciphertext: encrypted,
    salt,
    iv,
  };
};

export const decrypt = (encryptedData, key) => {
  const { ciphertext, salt, iv } = encryptedData;
  const derivedKey = deriveKey(key, salt);

  const decrypted = CryptoJS.AES.decrypt(ciphertext, derivedKey, {
    iv: CryptoJS.enc.Hex.parse(iv),
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
};