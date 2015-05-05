var zlib = require('zlib');
var crypto = require('crypto');
var combine = require('multipipe');
var fs = require('fs');

module.exports.compressAndEncrypt = function (password) {
  return combine(
    zlib.createGzip(),
    crypto.createCipher('aes192', password)
  );
}

module.exports.decryptAndDecompress = function (password) {
  return combine(
    crypto.createDecipher('aes192', password),
    zlib.createGunzip()
  );
}
