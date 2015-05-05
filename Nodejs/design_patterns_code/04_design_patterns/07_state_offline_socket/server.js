var jot = require('json-over-tcp');
var server = jot.createServer(5000);
server.on('connection', function(socket) {
  socket.on('data', function(data){
    console.log('Client data', data);
  });
});
server.listen(5000, function() {console.log('Started')});
