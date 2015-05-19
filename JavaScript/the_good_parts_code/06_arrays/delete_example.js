var numbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
delete numbers[2]; //[ 'zero', 'one', , 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine' ]
console.log(numbers);

var numbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
numbers.splice(2,1);
console.log(numbers); //['zero', 'one', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
