var sublevel = require('level-sublevel');
var level = require('level');
var uuid = require('node-uuid');
var async = require('async');

var db = sublevel(level('example-db', {valueEncoding: 'json'}));
var salesDb = db.sublevel('sales');
var items = ['book', 'game', 'app', 'song', 'movie'];

async.times(100000, function(n, callback) {
  salesDb.put(uuid.v4(), {
    amount: Math.ceil(Math.random() * 100),
    item: items[Math.floor(Math.random() * 5)]
  }, callback);
}, function(err) {
  if(err) {
    return console.log(err);
  }
  console.log('DB populated');
});

