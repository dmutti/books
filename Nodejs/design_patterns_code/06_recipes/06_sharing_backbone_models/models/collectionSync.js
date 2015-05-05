var db = require('../db');
var Backbone = require('backbone');

var self = module.exports = function(method, model, options) {
  switch(method) {
    case 'read':
      return self.readCollection(model, options);
    default:
      options.error({error: 'Unsupported'});
  }
};

self.readCollection = function(model, options) {
  var collection = db.sublevel(model.collectionName);
  var results = [];
  collection.createReadStream()
    .on('data', function(item) {
      item.value.id = item.key;
      results.push(item.value);
    })
    .on('end', function() {
      options.success(results);
    });
}
