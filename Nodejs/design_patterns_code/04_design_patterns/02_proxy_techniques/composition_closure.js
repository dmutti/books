var Subject = require('./Subject');

function createProxy(subject) {
  return {
    //proxied method
    hello: function() {
      return subject.hello() + ' world!';
    },
  
    //delegated method
    goodbye: function() {
      return subject.goodbye.apply(subject, arguments);
    }
  };
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

