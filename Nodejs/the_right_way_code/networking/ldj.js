//The following code sets up LDJClient to inherit from EventEmitter
"use strict";
const
    events = require('events'),
    util = require('util'),
    //client constructor
    LDJClient = function (stream) {
        events.EventEmitter.call(this);
        let self = this,
            buffer = '';
        stream.on('data', function(data) {
            buffer += data;
            let boundary = buffer.indexOf('\n');
            while (boundary !== -1) {
                let input = buffer.substr(0, boundary);
                buffer = buffer.substr(boundary + 1);
                self.emit('message', JSON.parse(input));
                boundary = buffer.indexOf('\n');
            }
        });
    };
util.inherits(LDJClient, events.EventEmitter);

// expose module methods
exports.LDJClient = LDJClient;
exports.connect = function(stream) {
    return new LDJClient(stream);
};