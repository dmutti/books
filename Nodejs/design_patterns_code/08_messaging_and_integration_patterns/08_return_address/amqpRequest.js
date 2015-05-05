var uuid = require('node-uuid');
var amqp = require('amqplib');

function AMQPRequest() {
  this.idToCallbackMap = {};
}

AMQPRequest.prototype.initialize = function() {
  var self = this;
  return amqp
    .connect('amqp://localhost')
    .then(function(conn) {
      return conn.createChannel();
    })
    .then(function(channel) {
      self.channel = channel;
      return channel.assertQueue('', {exclusive: true});
    })
    .then(function(q) {
      self.replyQueue = q.queue;
      return self._listenForResponses();
    })
    .catch(function(err) {
      console.log(err);
    });
}

AMQPRequest.prototype._listenForResponses = function() {
  var self = this;
  return this.channel.consume(this.replyQueue, function(msg) {
    var correlationId = msg.properties.correlationId;
    var handler = self.idToCallbackMap[correlationId];
    if(handler) {
      handler(JSON.parse(msg.content.toString()));
    }
  }, {noAck: true});
}

AMQPRequest.prototype.request = function(queue, message, callback) {
  var id = uuid.v4();
  this.idToCallbackMap[id] = callback;
  this.channel.sendToQueue(queue, 
    new Buffer(JSON.stringify(message)), 
    {correlationId: id, replyTo: this.replyQueue}
  );
}
  
  
module.exports = function() {
  return new AMQPRequest();
}
