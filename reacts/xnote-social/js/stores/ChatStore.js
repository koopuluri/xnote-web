var GroupDispatcher = require('../dispatcher/GroupDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var _ = require('underscore');

var _chat = [];
var _isLoading = false;

function loadChatData(data) {
	_chat = data;
}

function chat(message) {
	_chat.push(message);
}

var ChatStore = _.extend({}, EventEmitter.prototype, {

	//Get chat items
	getChat: function() {
		return _chat;
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

	getLoading: function() {
        return _isLoading;
    },
});

GroupDispatcher.register(function(payload) {
	var action = payload.action;
	switch(action.actionType) {

		case Constants.RECEIVE_CHAT:
			loadChatData(action.data);
			break;

		case Constants.CHAT_MESSAGE:
			chat(action.message);
			break;

		case XnoteConstants.SET_CHAT_LOADING:
	        _isLoading = action.isLoading;
        break;
			
		default:
			return true;
	}
	ChatStore.emitChange();
	return true;
})

module.exports = ChatStore;
