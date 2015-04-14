const
    http = require('http'),
    server = http.createServer(function(req, res) {
        res.writeHead(200, { 'Content-Type' : 'text/plain' });
        res.end('Hello World\n');
    });
server.listen(3000, function() {
    console.log('server up!')
});