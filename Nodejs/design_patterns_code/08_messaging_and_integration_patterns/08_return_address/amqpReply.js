var amqp = require('amqplib');

function AMQPReply(qName) {
  this.qName = qName;
}

AMQPReply.prototype.initialize = function() {
  var self = this;
  return amqp
    .connect('amqp://localhost')
    .then(function(conn) {
      return conn.createChannel();
    })
    .then(function(channel) {
      self.channel = channel;
      return self.channel.assertQueue(self.qName);
    })
    .then(function(q) {
      self.queue = q.queue;
    })
    .catch(function(err) {
      console.log(err.stack);
    });
}


AMQPReply.prototype.handleRequest = function(handler) {
  var self = this;
  return self.channel.consume(self.queue, function(msg) {
    var content = JSON.parse(msg.content.toString());
    handler(content, function(reply) {
      self.channel.sendToQueue(
        msg.properties.replyTo,
        new Buffer(JSON.stringify(reply)),
        {correlationId: msg.properties.correlationId}
      );
      self.channel.ack(msg);
    });
  });
}

module.exports = function(excName, qName, pattern) {
  return new AMQPReply(excName, qName, pattern);
}
