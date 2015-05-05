var request = require('request');
var http = require('http');
var start = Date.now();
var count = 20;
var interval = 200;
var completed = count;
var agent = new http.Agent();
agent.maxSockets = count;
var query = process.argv[2] ? process.argv[2] : 'item=book';
var id = setInterval(function() {
  request({
    url: 'http://localhost:8000?'+query,
    pool: agent
  }, 
    function(err, res) {
    if(err) return console.log(err);
    console.log(res.statusCode, res.body);
    if(!--completed) {
      console.log('All completed in: ' 
        + (Date.now() - start) + 'ms');
    }
  });
  if(!--count) {
    clearInterval(id);
  }
}, interval);
