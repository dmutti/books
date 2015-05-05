var amqp = require('amqplib');
var crypto = require('crypto');

var channel, queue;
amqp
  .connect('amqp://localhost')
  .then(function(conn) {
    return conn.createChannel();
  })
  .then(function(ch) {
    channel = ch;
    return channel.assertQueue('jobs_queue');
  })
  .then(function(q) {
    queue = q.queue;
    consume();
  })
  .catch(function(err) {
    console.log(err.stack);
  });

function consume() {
  channel.consume(queue, function(msg) {
    var data = JSON.parse(msg.content.toString());
    var variations = data.variations;
    variations.forEach(function(word) {
      console.log('Processing: ' + word);
      var shasum = crypto.createHash('sha1');
      shasum.update(word);
      var digest = shasum.digest('hex');
      if(digest === data.searchHash) {
        console.log('Found! => ' + word);
        channel.sendToQueue('results_queue', 
          new Buffer('Found! ' + digest + ' => ' + word));
      }
    });
    channel.ack(msg);
  });
};

