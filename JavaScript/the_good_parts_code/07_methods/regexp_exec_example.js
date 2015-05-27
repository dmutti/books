var text = '<html><body bgcolor=linen><p>' +
    'This is <b>bold<\/b>!<\/p><\/body><\/html>';

var tags = /[^<>]+|<(\/?)([A-Za-z]+)([^<>]*)>/g;
var a, i;

while (a = tags.exec(text)) {
    for (i = 0; i < a.length; i++) {
        console.log('// [' + i + '] ' + a[i]);
    }
    console.log();
}
