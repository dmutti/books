var combine = require('multipipe');
var fs = require('fs');
var decryptAndDecompressStream = 
    require('./combinedStreams').decryptAndDecompress;
    
combine(
  fs.createReadStream(process.argv[3]),
  decryptAndDecompressStream(process.argv[2]),
  fs.createWriteStream(process.argv[3].replace(/\.gz\.aes$/, ''))
).on('error', function(err) {
  //this error may come from any stream in the pipeline
  console.log(err);
});
