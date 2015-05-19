var numbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
numbers.length = 3;
console.log(numbers);
numbers[numbers.length] = 'tres';
console.log(numbers);
numbers.push('quatro');
console.log(numbers);
