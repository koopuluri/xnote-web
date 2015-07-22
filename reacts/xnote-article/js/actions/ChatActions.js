var GroupDispatcher = require('../dispatcher/Dispatcher');
var Constants = require('../constants/Constants');
var API = require('../utils/API');

var ChatActions = {

	_setChat: function(chat) {
		GroupDispatcher.handleAction({
			actionType: Constants.RECEIVE_CHAT,
			data: chat
		});
	},

	_setChatLoading: function(isLoading) {
		GroupDispatcher.handleAction({
				actionType: Constants.SET_CHAT_LOADING,
				isLoading: isLoading
		});
	},

	fetchChatSegment: function(groupId, start, count) {
		this._setChatLoading(true);
		var self = this;
		API.getChatSegment(groupId, start, count, function(obj) {
				if (!obj.error) {
					self._setChatLoading(false);
					GroupDispatcher.handleAction({
							actionType: Constants.ADD_CHAT_SEGMENT,
							chats: obj.chats
					});
				}
		});
	},

	incrementChatNotifCount: function() {
		GroupDispatcher.handleAction({
			actionType: Constants.INCREMENT_CHAT_NOTIF_COUNT
		});
	},

	fetchChatNotifCount: function(groupId) {
		API.fetchChatNotifCount(groupId, function(obj) {
			if (!obj.error) { 
				console.log('receved chat notif count: ' + obj.count);
				GroupDispatcher.handleAction({
					actionType: Constants.SET_CHAT_NOTIF_COUNT,
					count: obj.count
				});
			}
		});
	},

	clearChatNotifs: function(groupId) {
		GroupDispatcher.handleAction({
			actionType: Constants.RESET_CHAT_NOTIFS
		});

		API.clearChatNotifs(groupId, function(obj) {
			// do nothing.
		});
	},

	// this doesn't touch the chat counts... just adds the message.
	socketReceiveChat: function(chat) {
		this.addToChat(chat);
	},

	addToChat: function(chat) {
		GroupDispatcher.handleAction({
			actionType: Constants.CHAT_MESSAGE,
			chat: chat
		});
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



