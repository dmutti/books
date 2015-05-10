var myObject = {
    value: 0,
    increment: function(inc) {
        this.value += typeof inc === 'number' ? inc : 1;
    }
};

myObject.increment();
console.log(myObject.value); //1

myObject.increment(2);
console.log(myObject.value); //3
