var stream = require('stream');
var util = require('util');
var chance = require('chance').Chance();

function RandomStream(options) {
  stream.Readable.call(this, options);
}
util.inherits(RandomStream, stream.Readable);

RandomStream.prototype._read = function(size) {
  var chunk = chance.string();
  console.log('Pushing chunk of size:' + chunk.length); 
  this.push(chunk, 'utf8');
  if(chance.bool({likelihood: 5})) {
    this.push(null);
  } 
}

module.exports = RandomStream;
