var myObject = {
    value: 0,
    increment: function(inc) {
        this.value += typeof inc === 'number' ? inc : 1;
    },
    add: function(first, second) {
        return first + second;
    }
};

myObject.double = function() {
    var that = this; //workaround

    var helper = function() {
        that.value += that.add(that.value, that.value);
    };
    helper();
};

myObject.increment();
myObject.increment(2);
myObject.double();
console.log(myObject.value);
