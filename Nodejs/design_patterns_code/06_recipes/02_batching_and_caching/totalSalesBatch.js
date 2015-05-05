var totalSales = require('./totalSales');

var queues = {};
module.exports = function totalSalesBatch(item, callback) {
  if(queues[item]) {
    console.log('Batching operation');
    return queues[item].push(callback);
  }
  
  queues[item] = [callback];
  totalSales(item, function(err, res) {
    var queue = queues[item];
    queues[item] = null;
    queue.forEach(function(cb) {
      cb(err, res);
    });
  });
}
