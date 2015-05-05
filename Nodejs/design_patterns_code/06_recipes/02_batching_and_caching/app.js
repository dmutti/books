var http = require('http');
var url = require('url');
var totalSales = require('./totalSales');
//var totalSales = require('./totalSalesBatch');
//var totalSales = require('./totalSalesCache');

http.createServer(function(req, res) {
  var query = url.parse(req.url, true).query;
  totalSales(query.item, function(err, sum) {
    res.writeHead(200);
    res.end('Total sales for item ' + 
      query.item + ' is ' + sum);
  });
}).listen(8000, function() {console.log('Started')});
