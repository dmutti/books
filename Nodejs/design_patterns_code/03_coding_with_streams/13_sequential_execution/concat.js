var concatFiles = require('./concatFiles');
concatFiles(process.argv[2], process.argv.slice(3), function() {
  console.log('Files concatenated succesfully');
});
