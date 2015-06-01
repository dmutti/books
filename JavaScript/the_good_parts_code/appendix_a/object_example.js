var i;
var word;
var text = "This oracle of comfort has so pleased me," +
           "That when I am in heaven I shall desire" +
           "To see what this child does," +
           "and praise my Constructor.";

var words = text.toLowerCase().split(/[\s,.]+/);
var count = {};
for (i = 0; i < words.length; i++) {
    word = words[i];
    if (word.length === 0) {
        continue;
    }
    if (typeof count[word] === 'number') {
        count[word] += 1;
    } else {
        count[word] = 1;
    }
}
console.log(count);
