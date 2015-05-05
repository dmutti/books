var fs = require('fs');
function readJSONThrows(filename, callback) {
  fs.readFile(filename, 'utf8', function(err, data) {
    if(err)
      return callback(err);
    //no errors, propagate just the data
    callback(null, JSON.parse(data));
  });
};

readJSONThrows('nonJSON.txt', function(err) {
  console.log(err);
});
