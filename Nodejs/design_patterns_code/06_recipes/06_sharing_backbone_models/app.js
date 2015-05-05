var express = require('express');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var ecstatic = require('ecstatic');
var http = require('http');
var routes = require('./routes');

var app = module.exports = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(ecstatic({ root: __dirname + '/www' }));

app.get('/contacts', routes.listContacts);
app.post('/contacts', routes.createContact);
app.delete('/contacts/:id', routes.deleteContact);

app.use(errorHandler());
http.createServer(app).listen(8080, function () {
  console.log('Express server started');
});
