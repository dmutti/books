#!/usr/bin/env node --harmony
"use strict";

const
    express = require('express'),
    app = express();

app.use(express.logger('dev'));

const config = {
    bookdb: 'http://localhost:5984/books/',
    b4db: 'http://localhost:5984/b4/'
};

require('./lib/book-search.js')(config, app);
require('./lib/field-search.js')(config, app);
require('./lib/bundle.js')(config, app);

app.listen(3000, function(){
    console.log("server up!");
});