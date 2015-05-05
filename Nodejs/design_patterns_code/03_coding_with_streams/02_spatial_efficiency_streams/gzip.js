var fs = require('fs');
var zlib = require('zlib');
var file = process.argv[2];

fs.createReadStream(file)
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream(file + '.gz'))
  .on('finish', function() {
    console.log('File successfully compressed');
  });
