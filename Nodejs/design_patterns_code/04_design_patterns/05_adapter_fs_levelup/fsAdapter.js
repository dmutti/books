var path = require('path');

module.exports = function createFsAdapter(db) {
  var fs = {};
  
  fs.readFile = function(filename, options, callback) {
    if(typeof options === 'function') {
      callback = options;
      options = {};
    } else if(typeof options === 'string') {
      options = {encoding: options};
    }
    
    db.get(path.resolve(filename), {
        valueEncoding: options.encoding
      },
      function(err, value) {
        if(err) {
          if(err.type === 'NotFoundError') {
            err = new Error('ENOENT, open \'' + filename +'\'');
            err.code = 'ENOENT';
            err.errno = 34;
            err.path = filename;
          }
          return callback && callback(err);
        }
        callback && callback(null, value);
      }
    );
  };

  fs.writeFile = function(filename, contents, options, callback) {
    if(typeof options === 'function') {
      callback = options;
      options = {};
    } else if(typeof options === 'string') {
      options = {encoding: options};
    }
    
    db.put(path.resolve(filename), contents, {
      valueEncoding: options.encoding
    }, callback);
  }
  
  return fs;
}

