'use strict';

const
    Q = require('q'),
    request = require('request');

module.exports = function(config, app) {

    //create a new bundle with the specified name
    //curl -X POST http://localhost:3000/api/bundle?name=<name>
    app.post('/api/bundle', function(req, res) {
        let deferred = Q.defer();
        request.post({
            url: config.b4db,
            json: { type: 'bundle', name: req.query.name, books: {} }
        }, function(err, couchRes, body) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve([couchRes, body]);
            }
        });
        deferred.promise.then(function(args) {
            let couchRes = args[0], body = args[1];
            res.json(couchRes.statusCode, body);
        }, function(err) {
            res.json(502, { error: "bad_gateway", reason: err.code });
        });
    });
};