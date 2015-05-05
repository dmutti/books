  var stream = require('stream');
var util = require('util');

function ParallelStream(userTransform) {
  stream.Transform.call(this, {objectMode: true});
  this.userTransform = userTransform;
  this.running = 0;
  this.terminateCallback = null;
}
util.inherits(ParallelStream, stream.Transform);

ParallelStream.prototype._transform = 
  function(chunk, enc, done) {
    this.running++;
    this.userTransform(chunk, enc, this._onComplete.bind(this));
    done();
  }
  
  
ParallelStream.prototype._onComplete = function(err, chunk) {
  this.running--;
  if(err) {
    return this.emit('error', err);
  }
  if(this.running === 0) {
    this.terminateCallback && this.terminateCallback();
  }
}
  
ParallelStream.prototype._flush = function(done) {
  if(this.running > 0) {
    this.terminateCallback = done;
  } else {
    done();
  }
}

module.exports = ParallelStream;

