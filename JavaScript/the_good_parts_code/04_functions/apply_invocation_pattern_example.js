var add = function(a, b) {
    return a + b;
};

var array = [3, 4];
var sum = add.apply(null, array);
console.log(sum);

//----------------------------------

var statusObject = {
    status: 'A-OK'
};

var Quo = function (string) {
    this.status = string;
};

Quo.prototype.get_status = function () {
    return this.status;
};

var status = Quo.prototype.get_status.apply(statusObject);
console.log(status);//A-OK
