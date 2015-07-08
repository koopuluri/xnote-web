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
					actionType: GroupConstants.RECEIVE_CHAT,
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

		addFeedObject: function(obj) {

		},

		addNote: function(highlightId, content) {
			var note = {
					//TODO: Get the current user and the ID
					createdBy: {
						name : 'Vignesh',
						id : 'qwerqwer'
					},

					createdAt: GroupUtils.getTimestamp(),
					content: content,
					noteId: GroupUtils.generateUUID(),
					highlightId: highlightId
			}

			GroupDispatcher.handleAction({
					actionType: GroupConstants.ADD_NOTE,
					note: note
			});
		},

		editNote: function(note, content) {
				note.content = content;
				GroupDispatcher.handleAction({
						actionType: GroupConstants.EDIT_NOTE,
						note: note
				});
		},

		deleteNote: function(note) {
			GroupDispatcher.handleAction({
				actionType: GroupConstants.DELETE_NOTE,
				note: note
			});
		},

		chat: function(content) {
				GroupDispatcher.handleAction({
						actionType: GroupConstants.CHAT_MESSAGE,
						content: content
				});
		},

		setViewMode: function(data) {
				GroupDispatcher.handleAction({
						actionType: Constants.SET_VIEW_MODE,
						data: data
				});
		},



}

module.exports = GroupActions;










'hi';
