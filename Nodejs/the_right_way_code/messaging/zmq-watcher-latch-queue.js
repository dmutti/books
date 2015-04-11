"use strict";

const
    cluster = require('cluster'),
    zmq = require('zmq');

if (cluster.isMaster) {
    let
        //Create a PUSH socket and bind it to an IPC endpoint
        //this socket will be for sending jobs to the workers.
        pusher = zmq.socket('push').bind('ipc://to-worker.ipc'),

        //Create a PULL socket and bind to a different IPC endpoint
        //this socket will receive messages from workers.
        puller = zmq.socket('pull').bind('ipc://from-worker.ipc'),

        //Keep a count of ready workers (initialized to 0)
        ready = 0,

        distribution = {};

    //Listen for messages on the PULL socket, and
    puller.on('message', function(data) {
        let payload = JSON.parse(data);

        //If the message is a ready message, increment the ready counter
        if (payload.type === 'ready') {
            console.log('pid [' + payload.pid + '] - ready');
            ready++;

            //When the ready counter reaches 3, send
            //thirty job messages out through the PUSH socket.
            if (ready == 3) {
                for (let i = 0; i < 30; i++) {
                    pusher.send(JSON.stringify(
                        {
                            jobid : i,
                            timestamp : Date.now()
                        }
                    ));
                }
            }

        //If the message is a result message, output it to the console.
        } else if (payload.type === 'result') {
            console.log('pid [' + payload.pid + '] - result [' + payload.content + ']');
            if (!(payload.pid in distribution)) {
                distribution[payload.pid] = 1;
            } else {
                distribution[payload.pid] = distribution[payload.pid] + 1;
            }

        } else {
            console.log('pid [' + payload.pid + '] - unknown type [' + payload.type + ']');
        }
    });

    //Spin up three worker processes.
    for (let i = 0; i < 3; i++) {
        cluster.fork();
    }

    process.on('SIGINT', function() {
        console.log('job distribution\npid:count', distribution);
        process.exit();
    });

} else {

    //Create a PULL socket and connect it to the master’s PUSH endpoint.
    let puller = zmq.socket('pull').connect('ipc://to-worker.ipc');

    //Create a PUSH socket and connect it to the master’s PULL endpoint.
    let pusher = zmq.socket('push').connect('ipc://from-worker.ipc');

    //Listen for messages on the PULL socket, and
    puller.on('message', function(data) {
        let payload = JSON.parse(data);

        console.log('[' + process.pid + '] received job # [' + payload.jobid + '] created at [' + new Date(payload.timestamp) + ']');
        //Treat this as a job and respond by sending a result
        //message out on the PUSH socket.
        pusher.send(JSON.stringify(
            {
                pid : process.pid,
                type: 'result',
                content : 'ok',
                timestamp : Date.now()
            }
        ));
    });
    //Send a ready message out on the PUSH socket.
    pusher.send(JSON.stringify(
        {
            pid : process.pid,
            type : 'ready',
            content : 'ready to go'
        }
    ));
}