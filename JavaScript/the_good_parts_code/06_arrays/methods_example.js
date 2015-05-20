Function.prototype.method = function(name, func) {
    this.prototype[name] = func;
    return this;
};

Array.method('reduce', function(f) {
    var i, value;
    for (i = 0; i < this.length; i++) {
        value = f(this[i], value);
    }
    return value;
});

var add = function(a, b) {
    if (b === undefined) {
        return a;
    }
    if (a === undefined) {
        return b;
    }
    return a + b;
};

var mult = function(a, b) {
    if (b === undefined) {
        return a;
    }
    if (a === undefined) {
        return b;
    }
    return a * b;
}
var data = [4, 8, 15, 16, 23, 42];
console.log(data.reduce(add));
console.log(data.reduce(mult));

data.sum = function() {
    return data.reduce(add);
}
console.log(data.sum());
