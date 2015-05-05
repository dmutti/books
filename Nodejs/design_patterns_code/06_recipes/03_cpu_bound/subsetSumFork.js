var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
var ProcessPool = require('./processPool');
var workers = new ProcessPool(__dirname + '/subsetSumWorker.js', 2);

function SubsetSumFork(sum, set) {
  EventEmitter.call(this);
  this.sum = sum;
  this.set = set;
}
inherits(SubsetSumFork, EventEmitter);
module.exports = SubsetSumFork;

SubsetSumFork.prototype.start = function() {
  workers.acquire(function(err, worker) {
    worker.send({sum: this.sum, set: this.set});
    
    var onMessage = function(msg) {
      if(msg.event === 'end') {
        worker.removeListener('message', onMessage);
        workers.release(worker);
      }
      
      this.emit(msg.event, msg.data);
    }.bind(this);
    
    worker.on('message', onMessage);
  }.bind(this));
}
