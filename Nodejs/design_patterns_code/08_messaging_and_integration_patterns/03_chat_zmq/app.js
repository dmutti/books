var WebSocketServer = require('ws').Server;
var args = require('minimist')(process.argv.slice(2));
var zmq = require('zmq');

//static file server 
var server = require('http').createServer( 
  require('ecstatic')({root: __dirname + '/www'}) 
);

var pubSocket = zmq.socket('pub');
pubSocket.bind('tcp://127.0.0.1:' + args['pub']);

var subSocket = zmq.socket('sub');
var subPorts = [].concat(args['sub']);
subPorts.forEach(function(p) {
  console.log('Subscribing to ' + p);
  subSocket.connect('tcp://127.0.0.1:' + p);
});
subSocket.subscribe('chat');

subSocket.on('message', function(msg) {
  console.log('From other server: ' + msg);
  broadcast(msg.toString().split(' ')[1]);
});

var wss = new WebSocketServer({server: server}); 
wss.on('connection', function(ws) { 
  console.log('Client connected'); 
  ws.on('message', function(msg) { 
    console.log('Message: ' + msg);
    broadcast(msg);
    pubSocket.send('chat ' + msg);
  }); 
}); 

function broadcast(msg) {
  wss.clients.forEach(function(client) { 
    client.send(msg); 
  }); 
}

server.listen(args['http'] || 8080);
