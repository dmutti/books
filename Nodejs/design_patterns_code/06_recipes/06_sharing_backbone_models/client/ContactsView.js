var Backbone = require('backbone');
var Contacts = require('../models/Contacts');
var Contact = require('../models/Contact');
var $ = require('jquery');
var _ = require('underscore');

module.exports = Backbone.View.extend({
  initialize: function() {
    this.template = _.template($('#contacts-tpl').html());
    this.contacts = new Contacts();
    this.contacts.on("add", this.render, this);
    this.contacts.on("remove", this.render, this);
    this.contacts.on("reset", this.render, this);
    this.contacts.fetch({reset: true});
  },
  
  events: {
    'submit #newContactForm': 'createContact',
    'click ul a': 'removeContact'
  },
  
  createContact: function(evt) {
    evt.preventDefault();
    var contactJson = {
      name: $('#newContactForm input[name=name]').val(),
      email: $('#newContactForm input[name=email]').val(),
      phone: $('#newContactForm input[name=phone]').val()
    };
    var contact = new Contact(contactJson);
    $('.error-container', this.$el).empty();
    contact.once('invalid', this.invalid, this);
    contact.save({}, {success: function() {
      this.contacts.add(contact);
    }.bind(this)});
  },
  
  removeContact: function(evt) {
    evt.preventDefault();
    var id = $(evt.currentTarget.parentNode).data("id");
    var contact = this.contacts.get(id);
    contact.destroy({wait: true});
  },
  
  invalid: function(model, errors) {
    errors.forEach(function(error) {
      $('.error-container', this.$el).append(
        '<div class="alert alert-danger" role="alert">'+error+'</div>'
      );
    });
  },
  
  render: function() {
    var rendered = this.template({contacts: this.contacts.toJSON()});
    $(this.el).html(rendered);
    return this;
  }
});
