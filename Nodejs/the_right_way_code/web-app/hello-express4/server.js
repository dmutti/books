#!/usr/bin/env node --harmony
"use strict";
const
    express = require('express'),
    session = require('express-session'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    redisClient = require('redis').createClient(),
    RedisStore = require('connect-redis')(session),
    app = express();

app.use(morgan('dev'));

app.use(cookieParser());

app.use(session({
    secret: 'unguessable',
    resave: false,
    saveUninitialized: true,
    store: new RedisStore({
        client: redisClient
    })
}));

app.get('/api/:name', function(req, res) {
    res.status(200).json({ "hello": req.params.name });
});
app.listen(3000, function() {
    console.log('server up!');
});