exports.loaded = false; 
var b = require('./b'); 
module.exports = { 
  bWasLoaded: b.loaded, 
  loaded: true
};
