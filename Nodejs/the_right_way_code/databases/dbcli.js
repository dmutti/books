#!/usr/bin/env node --harmony
const
    request = require('request'),
    options = {
        method : process.argv[2] || 'GET',
        url : 'http://localhost:5984/' + (process.argv[3] || '')
    };

request(options, function(err, resp, body) {
    if (err) {
        throw Error(err);
    }
    console.log(resp.statusCode, JSON.parse(body));
});