var req = require('./amqpRequest')();

req.initialize().then(function() {
  for(var i = 100; i > 0; i--) {
    sendRandomRequest();
  }
});

function sendRandomRequest() {
  var a = Math.round(Math.random() * 100);
  var b = Math.round(Math.random() * 100);
  req.request('requests_queue', {a: a, b: b}, 
    function(res) {
      console.log(a + ' + ' + b + ' = ' + res.sum);
    }
  );
}
