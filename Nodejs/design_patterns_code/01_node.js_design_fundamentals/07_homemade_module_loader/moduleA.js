
var moduleB = require('./moduleB');

module.exports = {
  run: function() {
    moduleB.log();
  }
};
