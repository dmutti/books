var fs = require('fs');
//save the original require
var originalRequire = require;

function loadModule(filename, module, require) {
  var wrappedSrc =
    '(function(module, exports, require) {' +
      fs.readFileSync(filename, 'utf8') +
    '})(module, module.exports, require);';
  eval(wrappedSrc);
}

var require = function(moduleName) {
  console.log('Homemade require invoked for module: ' + moduleName);
  var id = require.resolve(moduleName); //[1]
  if(require.cache[id]) { //[2]
    return require.cache[id].exports;
  }

  //module metadata
  var module = { //[3]
    exports: {},
    id: id
  };
  //Update the cache
  require.cache[id] = module; //[4]

  //load the module
  loadModule(id, module, require); //[5]

  //return exported variables
  return module.exports; //[6]
};
require.cache = {};
require.resolve = function(moduleName) {
  //reuse the original resolving algorithm for simplicity
  return originalRequire.resolve(moduleName);
}

//Load the entry point using our homemade 'require'
require(process.argv[2]);
