var fork = require('child_process').fork;

function ProcessPool(file, poolMax) {
  this.file = file;
  this.poolMax = poolMax;
  this.pool = [];
  this.active = [];
  this.waiting = [];
}
module.exports = ProcessPool;

ProcessPool.prototype.acquire = function(callback) {
  var worker;
  if(this.pool.length > 0) {
    worker = this.pool.pop();
    this.active.push(worker);
    return process.nextTick(callback.bind(null, null, worker));
  }
  
  if(this.active.length >= this.poolMax) {
    return this.waiting.push(callback);
  }
  
  worker = fork(this.file);
  this.active.push(worker);
  process.nextTick(callback.bind(null, null, worker));
}


ProcessPool.prototype.release = function(worker) {
  if(this.waiting.length > 0) {
    var waitingCallback = this.waiting.shift();
    waitingCallback(null, worker);
  }
  this.active = this.active.filter(function(w) {
    return worker !== w;
  });
  this.pool.push(worker);
}
