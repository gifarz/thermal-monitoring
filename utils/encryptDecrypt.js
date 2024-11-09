import CryptoJS from "crypto-js";

// Encrypt
export const encryptData = (data, key) => {

    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    return ciphertext;

};

// Decrypt
export const decryptData = (ciphertext, key) => {

    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;

};