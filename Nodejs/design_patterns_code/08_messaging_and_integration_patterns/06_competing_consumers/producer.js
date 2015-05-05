var amqp = require('amqplib');
var variationsStream = require('variations-stream');
var alphabet = 'abcdefghijklmnopqrstuvwxyz';
var batchSize = 10000;
var maxLength = process.argv[2];
var searchHash = process.argv[3];

var connection, channel;
amqp
  .connect('amqp://localhost')
  .then(function(conn) {
    connection = conn;
    return conn.createChannel();
  })
  .then(function(ch) {
    channel = ch;
    produce();
  })
  .catch(function(err) {
    console.log(err);
  });

function produce() {
  var batch = [];
  variationsStream(alphabet, maxLength)
    .on('data', function(combination) {
      batch.push(combination);
      if(batch.length === batchSize) {
        var msg = {searchHash: searchHash, variations: batch};
        channel.sendToQueue('jobs_queue', 
          new Buffer(JSON.stringify(msg)));
        batch = [];
      }
    })
    .on('end', function() {
      //send remaining combinations
      var msg = {searchHash: searchHash, variations: batch};
      channel.sendToQueue(
          'jobs_queue', 
          new Buffer(JSON.stringify(msg)), 
          //when the last message is sent, close the connection
          //to allow the application to exit
          function() {
            channel.close();
            connection.close();
          }
      );
    });
}
