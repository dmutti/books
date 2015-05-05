var asyncModule = module.exports;

asyncModule.initialized = false;
asyncModule.initialize = function(callback) {
  setTimeout(function() {
    asyncModule.initialized = true;
    callback();
  }, 10000);
}

asyncModule.tellMeSomething = function(callback) {
  process.nextTick(function() {
    if(!asyncModule.initialized) {
      return callback(
        new Error('I don\'t have anything to say right now')
      );
    }
    callback(null, 'Current time is: ' + new Date());
  });
}
