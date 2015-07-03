var Dispatcher = require('flux').Dispatcher;

// Create dispatcher instance
var LoginSignUpDispatcher = new Dispatcher();

// Convenience method to handle dispatch requests
LoginSignUpDispatcher.handleAction = function(action) {
  this.dispatch({
    source: 'VIEW_ACTION',
    action: action
  });
}

module.exports = LoginSignUpDispatcher;
