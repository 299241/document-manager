import CryptoJS from 'crypto-js';

function encrypt(message = '', key = '') {
  const encryptedMessage = CryptoJS.AES.encrypt(message, key);
  return encryptedMessage.toString();
}
function decrypt(message = '', key = '') {
  const encryptedMessage = CryptoJS.AES.decrypt(message, key);
  const decryptedMessage = encryptedMessage.toString(CryptoJS.enc.Utf8);

  return decryptedMessage;
}

export default { encrypt, decrypt };
