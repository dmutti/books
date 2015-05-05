var http = require('http');
var routes = require('./routes');
var asyncModule = require('./asyncModule');

asyncModule.initialize(function() {
  console.log('Async module initialized');
});

http.createServer(function(req, res) {
  if (req.method === 'GET' && req.url === '/say') {
    return routes.say(req, res);
  }
  res.writeHead(404);
  res.end('Not found');
}).listen(8000, function() {console.log('Started')});

