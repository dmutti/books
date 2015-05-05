function asyncFlowWithThunks(generatorFunction) { 
  function callback(err) {
    if(err) { 
      return generator.throw(err); 
    }
    var results = [].slice.call(arguments, 1);
    var thunk = generator.next(results.length > 1 ? results : results[0]).value;
    thunk && thunk(callback);
  }; 
  var generator = generatorFunction(); 
  var thunk = generator.next().value;
  thunk && thunk(callback);
}

var fs = require('fs');
var readFileThunk = function(filename, options) {
  return function(cb) {
    fs.readFile(filename, options, cb);
  }
}
var writeFileThunk = function(filename, options) {
  return function(cb) {
    fs.writeFile(filename, options, cb);
  }
}

var path = require('path');

asyncFlowWithThunks(function* () {
  var fileName = path.basename(__filename);
  var myself = yield readFileThunk(fileName, 'utf8');
  yield writeFileThunk('clone_of_' + fileName, myself);
  console.log('Clone created');
});


