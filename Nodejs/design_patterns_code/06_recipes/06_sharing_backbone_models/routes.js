var Contacts = require('./models/Contacts');
var Contact = require('./models/Contact');

module.exports.listContacts = function(req, res, next) {
  var contacts = new Contacts();
  contacts.fetch({success: function() {
    res.status(200).json(contacts.toJSON());
  }});
}

module.exports.createContact = function(req, res, next) {
  var contact = new Contact(req.body);
  contact.once('invalid', function(model, errors) {
    res.status(400).json({error: errors});
  });
  contact.save({}, {success: function(contact) {
    res.status(200).json(contact);
  }});
}

module.exports.deleteContact = function(req, res, next) {
  var contact = new Contact({id: req.params.id});
  contact.destroy({success: function() {
    res.status(200).json(contact.toJSON());
  }});
}
