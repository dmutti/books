//sets up a variable with a constant value.
//The require() function pulls in a Node module and returns it.
const fs = require('fs');

fs.watch('/Users/danilomutti/Devel/nodejs/ch2/target.txt', function() {
    console.log("File 'target.txt' just changed!")
});
console.log("Now watching target.txt for changes...");
