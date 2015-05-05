function Subject() {
  this.salutation = 'Hello';
}
Subject.prototype.hello = function() {
  return this.salutation;
}
Subject.prototype.goodbye = function() {
  return 'Goodbye!'
}

module.exports = Subject;
