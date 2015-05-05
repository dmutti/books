var WebSocketServer = require('ws').Server;
var amqp = require('amqplib');
var JSONStream = require('JSONStream');
var httpPort = process.argv[2] || 8080;
var request = require('request');

//static file server 
var server = require('http').createServer( 
  require('ecstatic')({root: __dirname + '/www'}) 
);

var channel, queue;
amqp
  .connect('amqp://localhost')
  .then(function(conn) {
    return conn.createChannel();
  })
  .then(function(ch) {
    channel = ch;
    return channel.assertExchange('chat', 'fanout');
  })
  .then(function() {
    return channel.assertQueue('chat_srv_'+httpPort, {exclusive: true});
  })
  .then(function(q) {
    queue = q.queue;
    return channel.bindQueue(queue, 'chat');
  })
  .then(function() {
    return channel.consume(queue, function(msg) {
      msg = msg.content.toString();
      console.log('From queue: ' + msg);
      broadcast(msg);
    }, {noAck: true});
  })
  .catch(function(err) {
    console.log(err);
  });

var wss = new WebSocketServer({server: server}); 
wss.on('connection', function(ws) { 
  console.log('Client connected');
  //query the history service
  request('http://localhost:8090')
    .on('error', function(err) {
      console.log(err);
    })
    .pipe(JSONStream.parse('*'))
    .on('data', function(msg) {
      ws.send(msg);
    });
    
  ws.on('message', function(msg) { 
    console.log('Message: ' + msg);
    channel.publish('chat', '', new Buffer(msg));
  }); 
}); 

function broadcast(msg) {
  wss.clients.forEach(function(client) { 
    client.send(msg); 
  }); 
}

server.listen(httpPort);
