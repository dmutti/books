var $ = require('jquery');
var ContactsView = require('./ContactsView');
require('backbone').$ = $;

$(function() {
  var contactsView = new ContactsView({el: $("#contactsView") });
});
