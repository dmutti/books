var empty = [ ];
var numbers = ['zero', 'one', 'two'];
var misc = ['string', 98.6, false, null, undefined, ['nested', 'array'], {object: true}, NaN, Infinity];
console.log(empty[1]);//undefined
console.log(numbers[1]);//one
for (var i = 0; i < misc.length; i++) {
    console.log('//' + i + ': ' + misc[i]);
}
