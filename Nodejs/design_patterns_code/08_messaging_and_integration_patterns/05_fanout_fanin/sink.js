var zmq  = require('zmq')
var sink = zmq.socket('pull');
sink.bindSync("tcp://*:5001");

sink.on('message', function(buffer) {
  console.log('Message from worker: ', buffer.toString());
});
