var FindPattern = require('./FindPattern');

var findPatternObject = new FindPattern(/hello \w+/);
findPatternObject
  .addFile('fileA.txt')
  .addFile('fileB.json')
  .find()
  .on('found', function(file, match) {
    console.log('Matched “' + match + '” in file ' + file);
  })
  .on('error', function(err) {
    console.log('Error emitted ' + err.message);
  });
