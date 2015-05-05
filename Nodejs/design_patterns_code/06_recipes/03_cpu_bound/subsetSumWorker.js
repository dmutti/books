var SubsetSum = require('./subsetSum');

process.on('message', function(msg) {
  var subsetSum = new SubsetSum(msg.sum, msg.set);
  
  subsetSum.on('match', function(data) {
    process.send({event: 'match', data: data});
  });
  
  subsetSum.on('end', function(data) {
    process.send({event: 'end', data: data});
  });
  
  subsetSum.start();
});
