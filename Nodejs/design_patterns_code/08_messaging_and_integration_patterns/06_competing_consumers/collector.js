var amqp = require('amqplib');

var channel, queue;
amqp
  .connect('amqp://localhost')
  .then(function(conn) {
    return conn.createChannel();
  })
  .then(function(ch) {
    channel = ch;
    return channel.assertQueue('results_queue');
  })
  .then(function(q) {
    queue = q.queue;
    channel.consume(queue, function(msg) {
      console.log('Message from worker: ', msg.content.toString());
    });
  })
  .catch(function(err) {
    console.log(err.stack);
  });
