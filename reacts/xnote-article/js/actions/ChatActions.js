var Dispatcher = require('../dispatcher/Dispatcher');
var Constants = require('../constants/Constants');
var API = require('../utils/API');

var ChatActions = {

	_setChat: function(chat) {
		Dispatcher.handleAction({
			actionType: Constants.RECEIVE_CHAT,
			data: chat
		});
	},

	addToChat: function(chat) {
		Dispatcher.handleAction({
			actionType: Constants.CHAT_MESSAGE,
			chat: chat
		});
	},

	_setChatLoading: function(isLoading) {
		Dispatcher.handleAction({
				actionType: Constants.SET_CHAT_LOADING,
				isLoading: isLoading
		});
	},


	fetchAndSetChat: function(groupId) {
		var chat = JSON.parse(localStorage.getItem('chat'));
		this._setChat(chat);
	},

	fetchChatSegment: function(groupId, start, count) {
		this._setChatLoading(true);
		var self = this;
		API.getChatSegment(groupId, start, count, function(obj) {
				if (!obj.error) {
					self._setChatLoading(false);
					Dispatcher.handleAction({
							actionType: Constants.ADD_CHAT_SEGMENT,
							chats: obj.chats
					});
				}
		});
	},

	socketReceiveChat: function(chat) {
		this.addToChat(chat);
	},

	postChat: function(chat, groupId) {
		this.addToChat(chat);
		var self = this;
		// cloud persistence:
		API.postChat(chat, groupId, function(obj) {
			if (obj.error) {
				self.displaySnackMessage("Error posting chat");
			}
		});
	}
}

module.exports = ChatActions;