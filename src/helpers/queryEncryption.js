import CryptoJS from 'crypto-js';
import { auth } from '../config';

export function encode(data) {
  if (data) {
    const encryptedData = CryptoJS.AES.encrypt(data, `${auth.jwt}`).toString();
    return encryptedData;
  }
  return null;
}


export function decode(data) {
  if (data) {
    const bytes = CryptoJS.AES.decrypt(data, `${auth.jwt}`);
    const decodedData = bytes.toString(CryptoJS.enc.Utf8);
    return decodedData;
  }
  return null;
}
