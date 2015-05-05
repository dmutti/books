const fs = require('fs');

function readJSONThrows(filename, callback) {
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) {
            return callback(err);
        }
        callback(null, JSON.parse(data));
    });
};

process.on('uncaughtException', function(err) {
    console.error('This will catch at last the JSON parsing exception: ' + err.message);
    //without this, the application would continue
    process.exit(1);
});

readJSONThrows(process.argv[2]);
