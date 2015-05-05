
module.exports = function(channel) {

  return function registerHandler(handler) {
    channel.on('message', function(message) {
      if(message.type !== 'request') return;
      handler(message.data, function(reply) {
        channel.send({
          type: 'response',
          data: reply,
          inReplyTo: message.id
        });
      });
    });
  };
}
