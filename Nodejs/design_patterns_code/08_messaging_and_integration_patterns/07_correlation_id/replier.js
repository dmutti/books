var reply = require('./reply')(process);

reply(function(req, callback) {
  setTimeout(function() {
    callback({sum: req.a + req.b});
  }, req.delay);
});
