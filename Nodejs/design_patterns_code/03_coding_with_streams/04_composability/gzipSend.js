var fs = require('fs');
var zlib = require('zlib');
var http = require('http');
var path = require('path');
var crypto = require('crypto');
var file = process.argv[2];
var server = process.argv[3];

var options = {
  hostname: server,
  port: 3000,
  path: '/',
  method: 'PUT',
  headers: {
    filename: path.basename(file),
    'Content-Type': 'application/octet-stream',
    'Content-Encoding': 'gzip'
  }
};

var req = http.request(options, function(res) {
  console.log('Server response: ' + res.statusCode);
});

fs.createReadStream(file)
  .pipe(crypto.createCipher('aes192', 'a_shared_secret'))
  .pipe(zlib.createGzip())
  .pipe(req)
  .on('finish', function() {
    console.log('File successfully sent');
  });
