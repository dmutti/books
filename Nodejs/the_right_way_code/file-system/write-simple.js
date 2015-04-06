const fs = require('fs');
fs.writeFile('./target.txt', 'blah', function(err) {
    if (err) {
        throw err;
    }
    console.log("File saved!");
});