var GroupDispatcher = require('../dispatcher/GroupDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var _ = require('underscore');

//TODO: Remove dummy chat and feed notification values

var _chatNotifs = 0;
var _feedNotifs = 0;
var _notifs = []

function loadChatNotifs(data) {
	_chatNotifs = data;
}

function loadFeedNotifs(data) {
	_feedNotifs = data;
}

function resetChatNotifs() {
	_chatNotifs = 0;
}

function resetFeedNotifs() {
	_feedNotifs = 0;
}

var NotificationStore = _.extend({}, EventEmitter.prototype, {

	getChatNotifs: function() {
		return _chatNotifs;
	},

	getFeedNotifs: function() {
		return _feedNotifs;
	},

	getNotifs: function() {
		return _notifs;
	},

	//emit change event
	emitChange: function() {
		this.emit('notification-change');
	},

	//Add change listener
	addChangeListener: function(callback) {
		this.on('notification-change', callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener('notification-change', callback);
	}
});

GroupDispatcher.register(function(payload) {
	var action = payload.action;
	switch(action.actionType) {

		case Constants.RECEIVE_CHAT_NOTIFS:
			loadChatNotifs(action.data);
			break;

		case Constants.RECEIVE_FEED_NOTIFS:
			loadFeedNotifs(action.data);
			break;

		case Constants.RESET_CHAT_NOTIFS:
			resetChatNotifs();
			break;

		case Constants.RESET_FEED_NOTIFS:
			resetFeedNotifs();
			break;

		case Constants.SET_NOTIFS:
			_notifs = action.notifs;
			break;

		case Constants.ADD_NOTIF:
			_notifs.unshift(action.notif);
			break;

		default:
			return true;
	}
	
	NotificationStore.emitChange();
	return true;
})

module.exports = NotificationStore;
