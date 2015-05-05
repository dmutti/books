var http = require('http');
var fs = require('fs');
var crypto = require('crypto');
var zlib = require('zlib');

var server = http.createServer(function (req, res) {
  var filename = req.headers.filename;
  console.log('File request received: ' + filename);
  req
    .pipe(zlib.createGunzip())
    .pipe(crypto.createDecipher('aes192', 'a_shared_secret'))
    .pipe(fs.createWriteStream(filename))
    .on('finish', function() {
      res.writeHead(201, {'Content-Type': 'text/plain'});
      res.end('That\'s it\n');
      console.log('File saved: ' + filename);
    });
});

server.listen(3000, function () {
  console.log('Listening');
});
