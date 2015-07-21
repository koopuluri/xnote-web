var Dispatcher =  require('flux').Dispatcher;

//create dispatcher instance
var LandingDispatcher = new Dispatcher();

//Convenience method to handle dispatch requests
LandingDispatcher.handleAction = function(action) {
	this.dispatch({
		source: "VIEW_ACTION",
		action: action
	});
}

module.exports = LandingDispatcher;