const fs = require('fs');

function readJSONThrows(filename, callback) {
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) {
            return callback(err);
        }
        callback(null, JSON.parse(data));
    });
};

try {
    readJSONThrows(process.argv[2], function(err) {
        console.log(err);
    });
} catch (err) {
    console.log('This will not catch the JSON parsing exception')
}
