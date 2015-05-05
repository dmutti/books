var Subject = require('./Subject');

function createProxy(subject) {
  var proto = Object.getPrototypeOf(subject);
  
  function Proxy(subject) {
    this.subject = subject;
  }
  Proxy.prototype = Object.create(proto);
  
  //proxied method
  Proxy.prototype.hello = function() {
    return this.subject.hello() + ' world!';
  }
  
  //delegated method
  Proxy.prototype.goodbye = function() {
    return this.subject.goodbye
      .apply(this.subject, arguments);
  }
  
  return new Proxy(subject);
}


var subject = new Subject();
var proxy = createProxy(subject);
console.log('Is proxy instance of Subject? ', proxy instanceof Subject);
console.log('subject.saySomething(): ', subject.hello());
console.log('proxy.saySomething(): ', proxy.hello());
console.log('proxy.delegateSomething(): ', proxy.goodbye());
proxy.salutation = 'Ciao';
console.log('proxy.saySomething() after setting proxy.salutation: ', proxy.hello());
console.log('subject.saySomething() after setting proxy.salutation: ', subject.hello());

