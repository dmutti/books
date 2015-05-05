require('http').createServer(function (request, response) {
  if(request.url !== '/cmd') {
    response.writeHead(400);
    response.end();
  }
  var data = '';
  request.on('data', function(chunk) {
    data += chunk;
  });
  request.on('end', function() {
    console.log('Received the command: ', data);
    
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ok: true}));
  });
  
}).listen(3000, function() {console.log('Started')});
