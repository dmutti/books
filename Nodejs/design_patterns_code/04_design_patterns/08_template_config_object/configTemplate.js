var fs = require('fs');
var objectPath = require('object-path');

function ConfigTemplate() {}

ConfigTemplate.prototype.read = function(file) {
  console.log('Deserializing from ' + file);
  this.data = this._deserialize(fs.readFileSync(file, 'utf-8'));
}

ConfigTemplate.prototype.save = function(file) {
  console.log('Serializing to ' + file);
  fs.writeFileSync(file, this._serialize(this.data));
}

ConfigTemplate.prototype.get = function(path) {
  return objectPath.get(this.data, path);
}

ConfigTemplate.prototype.set = function(path, value) {
  return objectPath.set(this.data, path, value);
}

ConfigTemplate.prototype._serialize = function() {
  throw new Error('_serialize() must be implemented');
}

ConfigTemplate.prototype._deserialize = function() {
  throw new Error('_deserialize() must be implemented');
}
module.exports = ConfigTemplate;
