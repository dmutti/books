var myObject = function() {
    var value = 0;
    return {
        increment: function(inc) {
            value += typeof inc === 'number' ? inc : 1;
        },
        getValue: function() {
            return value;
        }
    };
}();

myObject.increment();
myObject.increment(2);
console.log(myObject.getValue());
