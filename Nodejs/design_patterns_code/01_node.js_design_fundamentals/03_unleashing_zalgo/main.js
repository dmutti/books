var fs = require('fs');

var cache = {};
//An inconsistent function
function inconsistentRead(filename, callback) {
  if(cache[filename]) {
    //invoked synchronously
    callback(cache[filename]);	
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
  inconsistentRead(filename, function(value) { 
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

//Unleash Zalgo
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




