var Backbone = require('backbone');
var validator = require('validator');

module.exports = Backbone.Model.extend({
  defaults: {
    name: '',
    email: '',
    phone: ''
  },
  validate: function(attrs, options) {
    var errors = [];
    if(!validator.isLength(attrs.name, 2)) {
      errors.push('Must specify a name');
    }
    if(attrs.email && !validator.isEmail(attrs.email)) {
      errors.push('Not a valid email');
    }
    if(attrs.phone && !validator.isNumeric(attrs.phone)) {
      errors.push('Not a valid phone');
    }
    if(!attrs.phone && !attrs.email) {
      errors.push('Must specify at least one contact information');
    }
    return errors.length ? errors : undefined;
  },
  collectionName: 'contacts',
  url: function() {
    if (this.isNew()) return this.collectionName;
    return this.collectionName + '/' + this.id;
  },
  sync: require('./modelSync')
});
