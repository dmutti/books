"use strict";
const
    file = require('file'),
    rdfParser = require('./lib/rdf-parser');

console.log('beginning directory walk');

file.walk(__dirname + '/cache', function (err, dirPath, dirs, files) {
    files.forEach(function(path) {
        rdfParser(path, function(err, doc) {
            if (err) {
                throw err;
            }
            console.log(doc);
        });
    });
});