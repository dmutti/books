var fs = require('fs');

function readJSONThrows(filename, callback) {
  fs.readFile(filename, 'utf8', function(err, data) { 
    if(err)
      return callback(err);
    //no errors, propagate just the data 
    callback(null, JSON.parse(data)); 
  });
};


try {
  readJSONThrows('nonJSON.txt', function(err, result) {
    if(err) {
      console.log('This error can come ONLY ' + 
        ' from fs.readFile(): ' + err.message);
    } else {
      console.log('Parsed: ' + JSON.stringify(result));
    }
  });
} catch(err) {
  console('This will not catch the JSON parsing exception');
}

process.on('uncaughtException', function(err){ 
  console.error('This will catch at last the ' +
    'JSON parsing exception: ' + err.message);
  //without this, the application would continue
  process.exit(1);
});


