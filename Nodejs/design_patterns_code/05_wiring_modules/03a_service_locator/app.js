var express = require('express');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var http = require('http');

var app = module.exports = express();
app.use(bodyParser.json());

var svcLoc = require('./lib/serviceLocator')();

svcLoc.register('dbName', 'example-db');
svcLoc.register('tokenSecret', 'SHHH!');
svcLoc.factory('db', require('./lib/db'));
svcLoc.factory('authService', require('./lib/authService'));
svcLoc.factory('authController', require('./lib/authController'));

var authController = svcLoc.get('authController');

app.post('/login', authController.login);
app.get('/checkToken', authController.checkToken);


app.use(errorHandler());
http.createServer(app).listen(3000, function () {
  console.log('Express server started');
});
