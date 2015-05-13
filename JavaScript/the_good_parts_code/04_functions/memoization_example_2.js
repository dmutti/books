var memoizer = function(memo, fundamental) {
    var shell = function(n) {
        var result = memo[n];
        if (typeof result !== 'number') {
            result = fundamental(shell, n);
            memo[n] = result;
        }
        return result;
    };
    return shell;
};

var fibonacci = memoizer([0,1], function(shell, n) {
    return shell(n-1) + shell(n-2);
});

for (var i = 0; i <= 10; i++) {
    console.log('// ' + i + ': ' + fibonacci(i));
}

var factorial = memoizer([1,1], function(shell, n) {
    return n * shell(n-1);
});

for (var i = 0; i <= 10; i++) {
    console.log('// ' + i + ': ' + factorial(i));
}
