const crypto = require("crypto");

const decryptaHash = (data) => {
  let mykey = crypto.createDecipher("aes-128-cbc", process.env.ENCRYPTION_KEY);
  let mystr = mykey.update(data, "hex", "utf8");
  mystr += mykey.final("utf8");

  return mystr;
};

const encryptData = (data) => {
  let mykey = crypto.createCipher("aes-128-cbc", process.env.ENCRYPTION_KEY);
  let mystr = mykey.update(data, "utf8", "hex");
  mystr += mykey.final("hex");

  return mystr;
};

module.exports = {
  decryptaHash,
  encryptData,
};
