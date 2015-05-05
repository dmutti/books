var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;

function SubsetSum(sum, set) {
  EventEmitter.call(this);
  this.sum = sum;
  this.set = set;
  this.totalSubsets = 0;
}
inherits(SubsetSum, EventEmitter);
module.exports = SubsetSum;

SubsetSum.prototype._combine = function(set, subset) {
  for(var i = 0; i < set.length; i++) {
    var newSubset = subset.concat(set[i]);
    this._combine(set.slice(i + 1), newSubset);
    this._processSubset(newSubset);
  }
}

SubsetSum.prototype._processSubset = function(subset) {
  console.log('Subset', ++this.totalSubsets, subset);
  var res = subset.reduce(function(prev, item) {
    return prev + item;
  }, 0);
  if(res == this.sum) {
    this.emit('match', subset);
  }
}

SubsetSum.prototype.start = function() {
  this._combine(this.set, []);
  this.emit('end');
}

