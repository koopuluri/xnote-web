var Dispatcher = require('../dispatcher/Dispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var _ = require('underscore');

var _message = '';

function setSnackbarMessage(message) {
	_message = message;
}

var SnackStore = _.extend({}, EventEmitter.prototype, {

	//Get chat items
	getMessage: function() {
		return _message;
	},

	//emit change event
	emitChange: function() {
		this.emit('SnackChange');
	},

	//Add change listener
	addChangeListener: function(callback) {
		this.on('SnackChange', callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener('SnackChange', callback);
	}
});

Dispatcher.register(function(payload) {
	var action = payload.action;
	switch(action.actionType) {
		case Constants.SET_SNACKBAR_MESSAGE:
			setSnackbarMessage(action.message);
			break;

		default:
			return true;
	}
	SnackStore.emitChange();
	return true;
})

module.exports = SnackStore;
