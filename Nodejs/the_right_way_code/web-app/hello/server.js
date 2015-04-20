#!/usr/bin/env node --harmony
"use strict";
const
    express = require('express'),
    redisClient = require('redis').createClient(),
    RedisStore = require('connect-redis')(express),
    app = express();

app.use(express.logger('dev'));

app.use(express.cookieParser());

app.use(express.session({
    secret: 'unguessable',
    store: new RedisStore({
        client: redisClient
    })
}));

app.get('/api/:name', function(req, res) {
    res.json(200, { "hello": req.params.name });
});
app.listen(3000, function() {
    console.log('server up!');
});