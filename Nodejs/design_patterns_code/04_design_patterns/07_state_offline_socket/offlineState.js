var jot = require('json-over-tcp');

function OfflineState(failsafeSocket) {
  this.failsafeSocket = failsafeSocket;
}
module.exports = OfflineState;

OfflineState.prototype.send = function(data) {
  this.failsafeSocket.queue.push(data);
}

OfflineState.prototype.activate = function() {
  var self = this;
  function retry() {
    setTimeout(function() {
      self.activate();
    }, 500);
  }
  
  self.failsafeSocket.socket = jot.connect(
    self.failsafeSocket.options, 
    function() {
      self.failsafeSocket.socket.removeListener('error', retry);
      self.failsafeSocket.changeState('online');
    }
  );
  self.failsafeSocket.socket.once('error', retry);
}
