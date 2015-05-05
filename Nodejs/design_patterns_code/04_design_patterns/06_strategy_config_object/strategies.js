
module.exports.json = {
  deserialize: function(data) {
    return JSON.parse(data);
  },
  serialize: function(data) {
    return JSON.stringify(data, null, '  ');
  }
}

var ini = require('ini');
module.exports.ini = {
  deserialize: function(data) {
    return ini.parse(data);
  },
  serialize: function(data) {
    return ini.stringify(data);
  }
}
