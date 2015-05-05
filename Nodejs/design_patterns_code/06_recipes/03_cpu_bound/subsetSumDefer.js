var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;

function SubsetSumDefer(sum, set) {
  EventEmitter.call(this);
  this.sum = sum;
  this.set = set;
  this.totalSubsets = 0;
}
inherits(SubsetSumDefer, EventEmitter);
module.exports = SubsetSumDefer;

SubsetSumDefer.prototype._combineInterleaved = function(set, subset) {
  this.runningCombine++;
  setImmediate(function() {
    this._combine(set, subset);
    if(--this.runningCombine === 0) {
      this.emit('end');
    }
  }.bind(this));
}

SubsetSumDefer.prototype._combine = function(set, subset) {
  for(var i = 0; i < set.length; i++) {
    var newSubset = subset.concat(set[i]);
    this._combineInterleaved(set.slice(i + 1), newSubset);
    this._processSubset(newSubset);
  }
}

SubsetSumDefer.prototype._processSubset = function(subset) {
  console.log('Subset', ++this.totalSubsets, subset);
  var res = subset.reduce(function(prev, item) {
    return prev + item;
  }, 0);
  if(res == this.sum) {
    this.emit('match', subset);
  }
}

SubsetSumDefer.prototype.start = function() {
  this.runningCombine = 0;
  this._combineInterleaved(this.set, []);
}

