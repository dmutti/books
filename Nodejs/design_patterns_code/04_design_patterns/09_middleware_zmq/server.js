var zmq = require('zmq');
var ZmqMiddlewareManager = require('./zmqMiddlewareManager');
var middleware = require('./middleware');
var reply = zmq.socket("rep");
reply.bind('tcp://127.0.0.1:5000');

var zmqm = new ZmqMiddlewareManager(reply);
zmqm.use(middleware.zlib());
zmqm.use(middleware.json());

zmqm.use({
  inbound: function(message, next) {
    console.log('Received: ', message.data);
    if(message.data.action === 'ping') {
      this.send({action: 'pong', echo: message.data.echo});
    }
    next();
  }
});
