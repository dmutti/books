var Reply = require('./amqpReply');
var reply = Reply('requests_queue');

reply.initialize().then(function() {
  reply.handleRequest(function(req, callback) {
    console.log('Request received', req);
    callback({sum: req.a + req.b});
  });
});

