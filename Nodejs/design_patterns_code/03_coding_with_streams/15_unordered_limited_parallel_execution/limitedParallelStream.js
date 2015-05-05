var stream = require('stream');
var util = require('util');

function LimitedParallelStream(concurrency, userTransform) {
  stream.Transform.call(this, {objectMode: true});
  this.userTransform = userTransform;
  this.running = 0;
  this.continueCallback = null;
  this.terminateCallback = null;
  this.concurrency = concurrency;
}
util.inherits(LimitedParallelStream, stream.Transform);

LimitedParallelStream.prototype._transform = 
  function(chunk, enc, done) {
    this.running++;
    this.userTransform(chunk, enc, this._onComplete.bind(this));
    if(this.running < this.concurrency) {
      done();
    } else {
      this.continueCallback = done;
    }
  }
  
  
LimitedParallelStream.prototype._onComplete = 
  function(err, chunk) {
    this.running--;
    if(err) {
      return this.emit('error', err);
    }
    
    var tmpCallback = this.continueCallback;
    this.continueCallback = null;
    tmpCallback && tmpCallback();
    if(this.running === 0) {
      this.terminateCallback && this.terminateCallback();
    }
  }
  
LimitedParallelStream.prototype._flush = 
  function(done) {
    if(this.running > 0) {
      this.terminateCallback = done;
    } else {
      done();
    }
  }

module.exports = function(concurrency, transform) {
  return new LimitedParallelStream(concurrency, transform);
};

