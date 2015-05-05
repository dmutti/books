var OfflineState = require('./offlineState');
var OnlineState = require('./onlineState');

function FailsafeSocket(options) {
  this.options = options;
  this.queue = [];
  this.currentState = null;
  this.socket = null;
  this.states = {
    offline: new OfflineState(this),
    online: new OnlineState(this)
  }
  this.changeState('offline');
}

FailsafeSocket.prototype.changeState = function(state) {
  console.log('Activating state: ' + state);
  this.currentState = this.states[state];
  this.currentState.activate();
}

FailsafeSocket.prototype.send = function(data) {
  this.currentState.send(data);
}

module.exports = function(options) {
  return new FailsafeSocket(options);
};
