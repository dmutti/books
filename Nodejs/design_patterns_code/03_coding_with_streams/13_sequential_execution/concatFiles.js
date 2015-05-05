var fromArray = require('from2-array');
var through = require('through2');
var fs = require('fs');

function concatFiles(destination, files, callback) {
  var destStream = fs.createWriteStream(destination);
  
  fromArray.obj(files)
    .pipe(through.obj(function(file, enc, done) {
      var src = fs.createReadStream(file);
      src.pipe(destStream, {end: false});
      src.on('end', function() {
        done();
      });
    }))
    .on('finish', function() {
      destStream.end();
      callback();
    });
}

module.exports = concatFiles;
