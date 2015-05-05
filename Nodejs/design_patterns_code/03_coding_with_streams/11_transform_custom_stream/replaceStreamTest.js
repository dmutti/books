var ReplaceStream = require('./replaceStream');

var rs = new ReplaceStream('World', 'Node.js');
rs.on('data', function(chunk) {
  console.log(chunk.toString());
});

rs.write('Hello W');
rs.write('orld!');
rs.end();
