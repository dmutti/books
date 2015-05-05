var util = require('util');
var ConfigTemplate = require('./configTemplate');

function JsonConfig() {}
util.inherits(JsonConfig, ConfigTemplate);

JsonConfig.prototype._deserialize = function(data) {
    return JSON.parse(data);
};

JsonConfig.prototype._serialize = function(data) {
  return JSON.stringify(data, null, '  ');
}

module.exports = JsonConfig;
