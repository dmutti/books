var asyncModule = require('./asyncModule');

//The wrapper
var asyncModuleWrapper = module.exports;
asyncModuleWrapper.initialized = false;
asyncModuleWrapper.initialize = function() {
  activeState.initialize.apply(activeState, arguments);
};

asyncModuleWrapper.tellMeSomething = function() {
  activeState.tellMeSomething.apply(activeState, arguments);
};

//The state to use when the module is not yet initialized
var pending = [];
var notInitializedState = {

  initialize: function(callback) {
    asyncModule.initialize(function() {
      asyncModuleWrapper.initalized = true;
      activeState = initializedState;
      
      pending.forEach(function(req) {
        asyncModule[req.method].apply(null, req.args);
      });
      pending = [];
      
      callback();
    });
  },
  
  tellMeSomething: function(callback) {
    return pending.push({
      method: 'tellMeSomething',
      args: arguments
    });
  }
  
};

//The state to use when the module is initialized
var initializedState = asyncModule;


//Set the initial state to the notInitializedState
var activeState = notInitializedState;

