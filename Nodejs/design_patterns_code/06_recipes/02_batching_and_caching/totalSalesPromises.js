var totalSales = require('./totalSales');
var Promise = require('bluebird');
totalSales = Promise.promisify(totalSales);

var cache = {};
module.exports = function totalSalesPromises(item) {
  if(cache[item]) {
    return cache[item];
  }
  
  cache[item] = totalSales(item)
    .then(function(res) {
      setTimeout(function() {
        delete cache[item];
      }, 30 * 1000); //30 seconds expiry
      return res;
    })
    .catch(function(err) {
      delete cache[item];
      throw err;
    });
  return cache[item];
}
