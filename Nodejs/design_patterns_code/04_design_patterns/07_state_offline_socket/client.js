var createFailsafeSocket = require('./failsafeSocket');

var failsafeSocket = createFailsafeSocket({port: 5000});
setInterval(function() {
  //send current memory usage
  failsafeSocket.send(process.memoryUsage());
}, 1000);

