var func1 = function() {
    return
    {
        status: true
    }
};

var func2 = function() {
    return {
        status: true
    }
};

console.log(func1()); //undefined
console.log(func2()); //{ status: true }
