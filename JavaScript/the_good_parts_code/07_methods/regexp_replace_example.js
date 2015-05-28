var oldPhoneMask = /\((\d{2})\) (\d{4})-(\d{4})/g;
console.log("(19) 8100-1234".replace(oldPhoneMask, '$1 9$2-$3'));

console.log("(19) 8100-1234".replace(oldPhoneMask, function(text) {
    console.log(text);
    for (var i = 1; i < arguments.length; i++) {
        console.log('//match [' + i + '] ' + arguments[i]);
    }
    return '+55' + arguments[1] + '9' + arguments[2] + arguments[3];
}));
