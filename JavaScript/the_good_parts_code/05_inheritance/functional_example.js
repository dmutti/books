var mammal = function(spec) {
    var that = { };
    that.get_name = function() {
        return spec.name;
    };
    that.says = function() {
        return spec.saying || 'not_found';
    };
    return that;
};
var myMammal = mammal({name: 'Herb'});

var cat = function(spec) {
    spec.saying = spec.saying || 'meow';
    var that = mammal(spec);
    that.purr = function(n) {
        var i, s = '';
        if (s) {
            s += '-';
        }
        s += 'r';
    };
    that.get_name = function() {
        return that.says() + ' ' + spec.name + ' ' + that.says();
    };
    return that;
};
var myCat = cat({name: 'Henrietta'});

Function.prototype.method = function(name, func) {
    this.prototype[name] = func;
    return this;
};

Object.method('superior', function(name) {
    var that = this,
        method = that[name];
    return function() {
        return method.apply(that, arguments);
    };
});

var coolcat = function(spec) {
    var that = cat(spec),
        super_get_name = that.superior('get_name');
    that.get_name = function(n) {
        return 'like ' + super_get_name() + ' baby';
    };
    return that;
}

var myCoolCat = coolcat({name: 'bixby'});
console.log(myCoolCat.get_name());
