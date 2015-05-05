
var levelup = require('level');
var fsAdapter = require('./fsAdapter');
var db = levelup('./fsDB', {valueEncoding: 'binary'});
var fs = fsAdapter(db);
//try with the original fs module by uncommenting the following line
//var fs = require('fs');

fs.writeFile('file.txt', 'Hello!', function() {
  fs.readFile('file.txt', 'utf8', function(err, res) {
    console.log(res);
  });
});

fs.readFile('missing.txt', 'utf8', function(err, res) {
  console.log(err);
});
