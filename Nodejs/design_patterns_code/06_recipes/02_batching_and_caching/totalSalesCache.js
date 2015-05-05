var totalSales = require('./totalSales');

var queues = {};
var cache = {};
module.exports = function totalSalesBatch(item, callback) {
  var cached = cache[item];
  if(cached) {
    console.log('Cache hit');
    return process.nextTick(callback.bind(null, null, cached));
  }
  
  if(queues[item]) {
    console.log('Batching operation');
    return queues[item].push(callback);
  }
  
  queues[item] = [callback];
  totalSales(item, function(err, res) {
    if(!err) {
      cache[item] = res;
      setTimeout(function() {
        delete cache[item];
      }, 30 * 1000); //30 seconds expiry
    }
    
    var queue = queues[item];
    queues[item] = null;
    queue.forEach(function(cb) {
      cb(err, res);
    });
  });
}
