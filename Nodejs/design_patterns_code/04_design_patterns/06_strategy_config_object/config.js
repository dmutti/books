var fs = require('fs');
var objectPath = require('object-path');

function Config(strategy) {
  this.data = {};
  this.strategy = strategy;
}

Config.prototype.get = function(path) {
  return objectPath.get(this.data, path);
}

Config.prototype.set = function(path, value) {
  return objectPath.set(this.data, path, value);
}

Config.prototype.read = function(file) {
  console.log('Deserializing from ' + file);
  this.data = this.strategy.deserialize(fs.readFileSync(file, 'utf-8'));
}

Config.prototype.save = function(file) {
  console.log('Serializing to ' + file);
  fs.writeFileSync(file, this.strategy.serialize(this.data));
}
module.exports = Config;
