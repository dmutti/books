
module.exports = function levelSubscribe(db) {
  db.subscribe = function(pattern, listener) {
    db.on('put', function(key, val) {
      var match = Object.keys(pattern).every(function(k) {
        return pattern[k] === val[k];
      });
      if(match) {
        listener(key, val);
      }
    });
  };
  return db;
}
