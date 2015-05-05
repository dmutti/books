var zmq = require('zmq');
var crypto = require('crypto');
var fromVentilator = zmq.socket('pull');
var toSink = zmq.socket('push');

fromVentilator.connect('tcp://localhost:5000');
toSink.connect('tcp://localhost:5001');

fromVentilator.on('message', function(buffer) {
  var msg = JSON.parse(buffer);
  var variations = msg.variations;
  variations.forEach(function(word) {
    console.log('Processing: ' + word);
    var shasum = crypto.createHash('sha1');
    shasum.update(word);
    var digest = shasum.digest('hex');
    if(digest === msg.searchHash) {
      console.log('Found! => ' + word);
      toSink.send('Found! ' + digest + ' => ' + word);
    }
  });
});
