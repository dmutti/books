var a = { member: true };
var b = Object.create(a);
console.log(a.hasOwnProperty('member')); //true
console.log(b.hasOwnProperty('member')); //false
console.log(b.member); //true
