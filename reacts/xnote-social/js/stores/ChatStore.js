var GroupDispatcher = require('../dispatcher/GroupDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var _ = require('underscore');

var _chat = [];
var _isLoading = false;
var _isLazy = true;

var _notifCount = 0;

var _index = 0;
var _lastAddedChatId = null;

var SEG_SIZE = 15;

function loadChatData(data) {
	_chat = data;
}

var ChatStore = _.extend({}, EventEmitter.prototype, {

	//Get chat items
	getChat: function() {
		return _chat;
	},

	getLastAddedChatId: function() {
		return _lastAddedChatId;
	},

	isLazy: function() {
		return _isLazy;
	},

	getLoading: function() {
		return _isLoading;
	},

	getNotifCount: function() {
		return _notifCount;
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

		case Constants.CHAT_MESSAGE:
			var newChat = action.chat;
			if (! (_lastAddedChatId && _lastAddedChatId == newChat.chatId) ) {
				_chat.push(newChat);
				_lastAddedChatId = newChat.chatId;
			}
			break;

		case Constants.ADD_CHAT_SEGMENT: 
			var chats = action.chats;
			if (chats) {
				_chat = chats.reverse().concat(_chat);
				_index += chats.length;
			} else {
				// don't add the chat --> already exists
			}

			if(chats.length < SEG_SIZE) {
				_isLazy = false;
			}
			break;

		case Constants.SET_CHAT_LOADING:
	        _isLoading = action.isLoading;
        	break;
			
		case Constants.CLEAR_CHAT:
			_index = 0;
			_chat = [];
			break;

		case Constants.INCREMENT_CHAT_NOTIF_COUNT: 
			_notifCount++;
			break;

		case Constants.SET_CHAT_NOTIF_COUNT: 
			_notifCount = action.count;
			break;

		case Constants.RESET_CHAT_NOTIFS:
			_notifCount = 0;
			break;

		default:
			return true;
	}
	ChatStore.emitChange();
	return true;
})

module.exports = ChatStore;
























