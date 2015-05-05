var db = require('../db');
var Backbone = require('backbone');
var uuid = require('node-uuid');

var self = module.exports = function(method, model, options) {
  switch(method) {
    case 'create':
      return self.saveModel(model, options);
    case 'delete':
      return self.deleteModel(model, options);
    default:
      options.error({error: 'Unsupported'});
  }
};

self.saveModel = function(model, options) {
  var collection = db.sublevel(model.collectionName);
  var results = [];
  if(!model.id) model.set('id', uuid.v4());
  collection.put(model.id, model.toJSON(), function(err) {
    if(err) return options.error();
    options.success(model.toJSON());
  });
}


self.deleteModel = function(model, options) {
  var collection = db.sublevel(model.collectionName);
  collection.del(model.id, function(err) {
    if(err) return options.error();
    options.success();
  });
}
