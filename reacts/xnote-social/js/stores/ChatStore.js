var GroupDispatcher = require('../dispatcher/GroupDispatcher');
var EventEmitter = require('events').EventEmitter;
var GroupConstants = require('../constants/Constants');
var _ = require('underscore');

var _chat = [];

function loadChatData(data) {
	_chat = data;
}

function chat(content) {
	var message = {
		createdBy: {
			name: 'Vignesh',
			id: '1231'
		},
		createdAt: 50,
		content: content,
	}
	_chat.unshift(message);
}

var ChatStore = _.extend({}, EventEmitter.prototype, {

	//Get chat items
	getChat: function() {
		return _chat;
	},

	//emit change event
	emitChange: function() {
		this.emit('change');
	},

	//Add change listener
	addChangeListener: function(callback) {
		this.on('change', callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	}
});

GroupDispatcher.register(function(payload) {
	var action = payload.action;
	switch(action.actionType) {

		case GroupConstants.RECEIVE_CHAT:
			loadChatData(action.data);
			break;

		case GroupConstants.CHAT_MESSAGE:
			chat(action.content);
			break;

		default:
			return true;
	}
	ChatStore.emitChange();
	return true;
})

module.exports = ChatStore;
