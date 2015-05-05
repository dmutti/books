var fs = require('fs');

var cache = {};
//An consistently asynchronous function
function consistentReadAsync(filename, callback) {
  if(cache[filename]) {
    process.nextTick(function() {
      callback(cache[filename]);
    });
  } else {
    //asynchronous function
    fs.readFile(filename, 'utf8', function(err, data) {
      cache[filename] = data;
      callback(data);
    });
  }
}


//A function using our inconsistent function
function createFileReader(filename) { 
  var listeners = []; 
  consistentReadAsync(filename, function(value) { 
    listeners.forEach(function(listener) { 
      listener(value); 
    });
  });

  return {
    onDataReady: function(listener) { 
      listeners.push(listener); 
    }
  }; 
}

//Zalgo is tamed
var reader1 = createFileReader('data.txt');  
reader1.onDataReady(function(data) {
  console.log('First call data: ' + data);
  
  //...sometime later we try to read again from 
  //the same file 
  var reader2 = createFileReader('data.txt');
  reader2.onDataReady(function(data) { 
    console.log('Second call data: ' + data); 
  });
});

