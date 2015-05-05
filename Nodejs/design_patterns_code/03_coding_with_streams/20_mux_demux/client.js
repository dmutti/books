var child_process = require('child_process');
var net = require('net');
var path = require('path');


function multiplexChannels(sources, destination) {
  var totalChannels = sources.length;
  for(var i = 0; i < sources.length; i++) {
    sources[i]
      .on('readable', function(i) {
        var chunk;
        while((chunk = this.read()) !== null) {
          var outBuff = new Buffer(1 + 4 + chunk.length);
          outBuff.writeUInt8(i, 0);
          outBuff.writeUInt32BE(chunk.length, 1);
          chunk.copy(outBuff, 5);
          console.log('Sending packet to channel: ' + i);
          destination.write(outBuff);
        }
      }.bind(sources[i], i))
      .on('end', function() {
        if(--totalChannels === 0) {
          destination.end();
        }
      });
  }
}


var socket = net.connect(3000, function() {
  var child = child_process.fork(
    process.argv[2], 
    process.argv.slice(3),
    {silent: true}
  );
  multiplexChannels([child.stdout, child.stderr], socket);
});

