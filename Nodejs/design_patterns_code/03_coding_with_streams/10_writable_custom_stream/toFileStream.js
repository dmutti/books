var stream = require('stream');
var fs = require('fs');
var util = require('util');
var path = require('path');
var mkdirp = require('mkdirp');

function ToFileStream() {
  stream.Writable.call(this, {objectMode: true});
};
util.inherits(ToFileStream, stream.Writable);

ToFileStream.prototype._write = function(chunk, encoding, callback) {
  var self = this;
  mkdirp(path.dirname(chunk.path), function(err) {
    if(err) {
      return callback(err);
    }
    fs.writeFile(chunk.path, chunk.content, callback);
  });
}
module.exports = ToFileStream;
