var fs = require('fs');
var split = require('split');
var request = require('request');
var ParallelStream = require('./parallelStream');

fs.createReadStream(process.argv[2])
  .pipe(split())
  .pipe(new ParallelStream(function(url, enc, done) {
    if(!url) return done();
    var self = this;
    request.head(url, function(err, response) {
      self.push(url + ' is ' + (err ? 'down' : 'up') + '\n');
      done();
    });
  }))
  .pipe(fs.createWriteStream('results.txt'))
  .on('finish', function() {
    console.log('All urls were checked');
  });
