process.stdin
  .on('readable', function() {
    var chunk;
    console.log('New data available');
    while((chunk = process.stdin.read()) !== null) {
      console.log(
        'Chunk read: (' + chunk.length + ') "' + 
        chunk.toString() + '"'
      );
    }
  })
  .on('end', function() {
    process.stdout.write('End of stream');
  });
