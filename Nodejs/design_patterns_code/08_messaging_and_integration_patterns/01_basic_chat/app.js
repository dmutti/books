var WebSocketServer = require('ws').Server;

//static file server
var server = require('http').createServer(
  require('ecstatic')({root: __dirname + '/www'})
);

var wss = new WebSocketServer({server: server});
wss.on('connection', function(ws) {
  console.log('Client connected');
  ws.on('message', function(msg) {
    console.log('Message: ' + msg);
    broadcast(msg);
  });
});

function broadcast(msg) {
  wss.clients.forEach(function(client) {
    client.send(msg);
  });
}

server.listen(process.argv[2] || 8080);
