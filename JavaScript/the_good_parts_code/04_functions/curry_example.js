Function.prototype.method = function(name, func) {
    this.prototype[name] = func;
    return this;
};

Function.method('curry', function () {
    var slice = Array.prototype.slice,
        args = slice.apply(arguments),
        that = this;
    return function () {
        return that.apply(null, args.concat(slice.apply(arguments)));
    };
});

var add = function(a, b) {
    return a + b;
};

var add1 = add.curry(1);
console.log(add1(6)); //7
