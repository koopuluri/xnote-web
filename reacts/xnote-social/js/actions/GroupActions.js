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
				API.getGroup(groupId, function(result) {
						if (result.error) {
								// do nothing for now.

						}
						// set the group:
						var group = result.group
						self._setGroup(group);
						self._setArticleList(group.articles);
						self._setFeed(group.feedPosts);
				});
		},

		_setContentIsParsing(isParsing) {
				GroupDispatcher.handleAction({
					actionType: Constants.CONTENT_SET_PARSING,
					isParsing: isParsing
				});
		},

		_addArticle: function(article) {
				GroupDispatcher.handleAction({
					actionType: Constants.CONTENT_ADD_ARTICLE,
					article: article
				});
		},

		addArticleFromUrl: function(url, groupId) {
			this._setContentIsParsing(true);
			var self = this;
			API.addArticleFromUrl(url, groupId, function(data) {
					if (data.error) {

							return;
					}

					self._addArticle(data.article);
					self._setContentIsParsing(false);
			});
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

		chat: function(message) {
			GroupDispatcher.handleAction({
				actionType: Constants.CHAT_MESSAGE,
				message: message
			});
		},

		resetChatNotifs: function() {
				GroupDispatcher.handleAction({
						actionType: Constants.RESET_CHAT_NOTIFS
				});
		},

		resetFeedNotifs: function() {
				GroupDispatcher.handleAction({
						actionType: Constants.RESET_FEED_NOTIFS
				});
		},

		incrementFeedNotifs: function() {
				GroupDispatcher.handleAction({
						actionType: Constants.INCREMENT_FEED_NOTIFS
				});
		},

		socketReceivePost: function(post) {
				GroupDispatcher.handleAction({
						actionType: Constants.SOCKET_RECEIVE_POST,
						post: post
				});
		},

		socketReceiveNote: function(note, highlightId, postNotifCount) {
				GroupDispatcher.handleAction({
						actionType: Constants.SOCKET_RECEIVE_NOTE,
						note: note,
						highlightId: highlightId,
				});
		},

		socketReceiveChat: function(chat) {
				// do nothing for now...
		}
}

module.exports = GroupActions;




















''
