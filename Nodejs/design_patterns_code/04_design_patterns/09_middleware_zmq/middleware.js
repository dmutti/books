var zlib = require('zlib');

module.exports.zlib = function() {
  return {
    inbound: function(message, next) {
      zlib.inflateRaw(new Buffer(message.data), function(err, res) {
        message.data = res;
        next();
      });
    },
    outbound: function(message, next) {
      zlib.deflateRaw(message.data, function(err, res) {
        message.data = res;
        next();
      });
    }
  }
}

module.exports.json = function() {
  return {
    inbound: function(message, next) {
      message.data = JSON.parse(message.data.toString());
      next();
    },
    outbound:
      function(message, next) {
      message.data = new Buffer(JSON.stringify(message.data));
      next();
    }
  }
}
