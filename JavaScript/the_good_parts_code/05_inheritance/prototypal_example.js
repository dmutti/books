var myMammal = {
    name: 'Herb the Mammal',
    get_name: function() {
        return this.name;
    },
    says: function() {
        return this.saying || 'not_found';
    }
};

console.log(myMammal.says());//not_found

var myCat = Object.create(myMammal);
myCat.name = 'Henrietta';
myCat.saying = 'meow';
myCat.purr = function(n) {
    var i, s = '';
    for (i = 0; i < n; i++) {
        if (s) {
            s += '-';
        }
        s += 'r';
    }
    return s;
};
myCat.get_name = function() {
    return this.says() + ' ' + this.name + ' ' + this.says();
};

console.log(myCat.get_name()); //meow Henrietta meow
