var level = require('level');
var sublevel = require('level-sublevel');
var db = sublevel(level('example-db', {valueEncoding: 'json'}));
var salesDb = db.sublevel('sales');

module.exports = function totalSales(item, callback) {
  console.log('totalSales() invoked');
  var sum = 0;
  salesDb.createValueStream()
    .on('data', function(data) {
      if(!item || data.item === item) {
        sum += data.amount;
      }
    })
    .on('end', function() {
      callback(null, sum);
    });
}
