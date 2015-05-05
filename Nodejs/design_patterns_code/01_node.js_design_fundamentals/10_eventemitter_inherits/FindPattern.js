var EventEmitter = require('events').EventEmitter;
var util = require('util');
var fs = require('fs');

function FindPattern(regex) {
  EventEmitter.call(this);
  this.regex = regex;
  this.files = [];
}
util.inherits(FindPattern, EventEmitter);

FindPattern.prototype.addFile = function(file) {
  this.files.push(file);
  return this;
};

FindPattern.prototype.find = function() {
  var self = this;
  self.files.forEach(function(file) {
    fs.readFile(file, 'utf8', function(err, content) {
      if(err)
        return self.emit('error', err);
      
      self.emit('fileread', file);
      var match = null;
      if(match = content.match(self.regex))
        match.forEach(function(elem) {
          self.emit('found', file, elem);
        });
    });
  });
  return this;
};

module.exports = FindPattern;
