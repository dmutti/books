var uuid = require('node-uuid');

module.exports  = function(channel) {
  var idToCallbackMap = {};
  
  channel.on('message', function(message) {
    var handler = idToCallbackMap[message.inReplyTo];
    if(handler) {
      handler(message.data);
    }
  });
  
  return function sendRequest(req, callback) {
    var correlationId = uuid.v4();
    idToCallbackMap[correlationId] = callback;
    channel.send({
      type: 'request',
      data: req,
      id: correlationId
    });
  };
}
