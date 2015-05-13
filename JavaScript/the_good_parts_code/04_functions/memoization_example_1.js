var calls = 0;
var fibonacci_recursive = function(n) {
    calls++;
    return n < 2 ? n : fibonacci_recursive(n-1) + fibonacci_recursive(n-2);
};
for (var i = 0; i <= 10; i++) {
    fibonacci_recursive(i);
}
console.log('recursive calls [0..10]: ' + calls);

calls = 0;
var fibonacci_memoized = function() {
    var memo = [0, 1];
    var fib = function(n) {
        calls++;
        var result = memo[n];
        if (typeof result !== 'number') {
            result = fib(n-1) + fib(n-2);
            memo[n] = result;
        }
        return result;
    };
    return fib;
}();

for (var i = 0; i <= 10; i++) {
    fibonacci_memoized(i);
}
console.log('memoized calls [0..10]: ' + calls);
