var co = require('co');

function TaskQueue(concurrency) {
  this.concurrency = concurrency;
  this.running = 0;
  this.taskQueue = [];
  this.consumerQueue = [];
  this.spawnWorkers(concurrency);
}

TaskQueue.prototype.pushTask = function(task) {
  if(this.consumerQueue.length !== 0) {
    this.consumerQueue.shift()(null, task);
  } else {
    this.taskQueue.push(task);
  }
}

TaskQueue.prototype.spawnWorkers = function(concurrency) {
  var self = this;
  for(var i = 0; i < concurrency; i++) {
    co(function* () {
      while(true) {
        var task = yield self.nextTask();
        yield task;
      }
    })();
  }
}

TaskQueue.prototype.nextTask = function() {
  var self = this;
  return function(callback) {
    if(self.taskQueue.length !== 0) {
      callback(null, self.taskQueue.shift());
    } else {
      self.consumerQueue.push(callback);
    }
  }
}

module.exports = TaskQueue;
