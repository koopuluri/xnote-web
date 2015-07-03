var Dispatcher =  require('flux').Dispatcher;

//create dispatcher instance
var GroupDispatcher = new Dispatcher();

//Convenience method to handle dispatch requests
GroupDispatcher.handleAction = function(action) {
	this.dispatch({
		source: "VIEW_ACTION",
		action: action
	});
}

module.exports = GroupDispatcher;