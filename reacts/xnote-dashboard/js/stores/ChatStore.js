var Dispatcher = require('../dispatcher/Dispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var _ = require('underscore');

var _notifCount = {};

var ChatStore = _.extend({}, EventEmitter.prototype, {

	//Get chat items
	getNotifCount: function(groupId) {
		if(_notifCount[groupId]) {
			return _notifCount[groupId];
		} else {
			return 0;
		}
	},

	//emit change event
	emitChange: function() {
		this.emit('chat-change');
	},

	//Add change listener
	addChangeListener: function(callback) {
		this.on('chat-change', callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener('chat-change', callback);
	},
});

Dispatcher.register(function(payload) {
	var action = payload.action;
	switch(action.actionType) {

		case Constants.SET_CHAT_NOTIF_COUNT: 
			_notifCount[action.groupId] = action.count;
			break;
			
		default:
			return true;
	}
	ChatStore.emitChange();
	return true;
});

ChatStore.setMaxListeners(0);
module.exports = ChatStore;