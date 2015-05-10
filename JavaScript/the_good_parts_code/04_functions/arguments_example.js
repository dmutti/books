var sum = function() {
    var sum = 0;
    for (i in arguments) {
        sum += arguments[i];
    }
    return sum;
}

console.log(sum(1,2,3));
