var Backbone = require('backbone');
var Contact = require('./Contact');

module.exports = Backbone.Collection.extend({
  model: Contact,
  url: 'contacts',
  collectionName: 'contacts',
  sync: require('./collectionSync')
});
