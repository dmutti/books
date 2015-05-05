var fs = require('fs');
var zlib = require('zlib');

var file = process.argv[2];

fs.readFile(file, function(err, buffer) {
  if(err) {
    throw err;
  }
  zlib.gzip(buffer, function(err, buffer) {
    if(err) {
      throw err;
    }
    fs.writeFile(file + '.gz', buffer, function() {
      if(err) {
        throw err;
      }
      console.log('File successfully compressed');
    });
  });
});
