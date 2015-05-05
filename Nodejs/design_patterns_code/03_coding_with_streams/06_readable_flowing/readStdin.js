process.stdin
  .on('data', function(chunk) {
    console.log('New data available');
    console.log(
      'Chunk read: (' + chunk.length + ')" ' + 
      chunk.toString() + '"'
    );
  })
  .on('end', function() {
    process.stdout.write('End of stream');
  });
