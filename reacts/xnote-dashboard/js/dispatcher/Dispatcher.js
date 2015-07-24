var Dispatcher = require('flux').Dispatcher;

// Create dispatcher instance
var Dispatcher = new Dispatcher();

// Convenience method to handle dispatch requests
Dispatcher.handleAction = function(action) {
  this.dispatch({
    source: 'VIEW_ACTION',
    action: action
  });
}

module.exports = Dispatcher;
