exports.loaded = false; 
var a = require('./a'); 
module.exports = { 
  aWasLoaded: a.loaded,
  loaded: true
};
