var GroupDispatcher = require('../dispatcher/GroupDispatcher');
var Constants = require('../constants/Constants');
var GroupUtils = require('../utils/GroupUtils');
var API = require('../utils/API');

//Define actions object
var GroupActions = {

		_setUser: function(user) {
				GroupDispatcher.handleAction({
						actionType: Constants.SET_USER,
						user: user
				});
		},

		_setGroup: function(group) {
				GroupDispatcher.handleAction({
						actionType: Constants.SET_GROUP,
						group: group
				});
		},

		_setArticleList: function(articleList) {
				GroupDispatcher.handleAction({
						actionType: Constants.SET_ARTICLE_LIST,
						articleList: articleList
				});
		},

		_setFeed: function(feedPosts) {
				GroupDispatcher.handleAction({
						actionType: Constants.SET_FEED,
						feed: feedPosts
				});
		},

		_setChat: function(chat) {
			GroupDispatcher.handleAction({
					actionType: Constants.RECEIVE_CHAT,
					data: chat
			});
		},

		fetchAndSetChat: function(groupId) {
				var chat = JSON.parse(localStorage.getItem('chat'));
				this._setChat(chat);
		},

		fetchAndSetGroup: function(groupId) {
				var self = this;
				console.log('API: ' + Object.keys(API));
				API.getGroup(groupId, function(result) {
						if (result.error) {
								// do nothing for now.
								console.log('fetch and set group error');
						}

						console.log('got group!');
						// set the group:
						var group = result.group
						self._setGroup(group);
						self._setArticleList(group.articles);
						self._setFeed(group.feedPosts);
				});
		},

		addArticle: function(url) {
			//GroupDispatcher.handleAction({
			//	actionType: Constans.ADD_ARTICLE,
			//	action: action
			//})
		},

		addFeedObject: function(obj) {

		},

		addNote: function(highlightId, note) {
			GroupDispatcher.handleAction({
					actionType: Constants.ADD_NOTE,
					note: note
			});
		},

		editNote: function(note, content) {
				note.content = content;
				GroupDispatcher.handleAction({
						actionType: Constants.EDIT_NOTE,
						note: note
				});
		},

		deleteNote: function(note) {
			GroupDispatcher.handleAction({
				actionType: Constants.DELETE_NOTE,
				note: note
			});
		},

		chat: function(content) {
			GroupDispatcher.handleAction({
				actionType: Constants.CHAT_MESSAGE,
				content: content
			});
		},

		resetChatNotifs: function() {
			GroupDispatcher.handleAction({
				actionType: Constants.RESET_CHAT_NOTIFS
			})
		},

		resetFeedNotifs: function() {
			GroupDispatcher.handleAction({
				actionType: Constants.RESET_FEED_NOTIFS
			})
		},
}

module.exports = GroupActions;

