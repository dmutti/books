var fs = require('fs');

//This function shows how errors can be propagated to the next 
//callback in the chain
function readJSON(filename, callback) {
  fs.readFile(filename, 'utf8', function(err, data) {
    var parsed;
    if(err)
      //propagate the error to callback and end this function 
      return callback(err); 

    try { 
      //parse the file contents
      parsed = JSON.parse(data); 
    } catch(err) { 
      //catch parsing errors
      return callback(err); 
    } 
    //no errors, propagate just the data 
    callback(null, parsed); 
  });
};

//Example usage: read from a correctly formatted JSON file
readJSON('test.json', function(err, json) {
	if(err) {
		console.log("Error while reading test.json: " + err.message);
	} else {
		console.log("File test.json parsed correctly: " + JSON.stringify(json));
	}
});

//Example usage: read from a non-json file
readJSON('test.txt', function(err, json) {
	if(err) {
		console.log("Error while reading test.txt: " + err.message);
	} else {
		console.log("File test.txt parsed correctly: " + JSON.stringify(json));
	}
});

//Example usage: read from a missing file
readJSON('missing.json', function(err, json) {
	if(err) {
		console.log("Error while reading missing.json: " + err.message);
	} else {
		console.log("File missing.json parsed correctly: " + JSON.stringify(json));
	}
});

