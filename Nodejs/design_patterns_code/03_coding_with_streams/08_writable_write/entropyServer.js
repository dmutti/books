var chance = require('chance').Chance();
require('http').createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  while(chance.bool({likelihood: 95})) {
    res.write(chance.string() + '\n');
  }
  res.end('\nThe end...\n');
  res.on('finish', function() {
    console.log('All data was sent'); 
  });
}).listen(8080, function () {
  console.log('Listening');
});
