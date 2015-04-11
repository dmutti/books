"use strict";
const
    zmq = require('zmq'),
    filename = process.argv[2],
    // create request endpoint
    requester = zmq.createSocket('req');

// handle replies from responder
requester.on('message', function(data) {
    let response = JSON.parse(data);
    console.log('Received response [' + response.content + "]");
    requester.close();
});

requester.connect('tcp://localhost:5433');

//send request for content
console.log('Sending request for [' + filename + ']');
requester.send(JSON.stringify(
    {
        path : filename
    }
));