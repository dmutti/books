
function ZmqMiddlewareManager(socket) {
  this.socket = socket;
  this.inboundMiddleware = [];
  this.outboundMiddleware = [];
  var self = this;
  socket.on('message', function(message) {
    self.executeMiddleware(self.inboundMiddleware, {
      data: message
    });
  });
}
module.exports = ZmqMiddlewareManager;

ZmqMiddlewareManager.prototype.send = function(data) {
  var self = this;
  var message = {
    data: data
  };
  
  self.executeMiddleware(self.outboundMiddleware, message, 
    function() {
      self.socket.send(message.data);
    }
  );
}

ZmqMiddlewareManager.prototype.use = function(middleware) {
  if(middleware.inbound) {
    this.inboundMiddleware.push(middleware.inbound);
  }
  if(middleware.outbound) {
    this.outboundMiddleware.unshift(middleware.outbound);
  }
}

ZmqMiddlewareManager.prototype.executeMiddleware = 
  function(middleware, arg, finish) {
    var self = this;
    (function iterator(index) {
      if(index === middleware.length) {
        return finish && finish();
      }
      middleware[index].call(self, arg, function(err) {
        if(err) {
          console.log('There was an error: ' + err.message);
        }
        iterator(++index);
      });
    })(0);
  }

