var GroupDispatcher = require('../dispatcher/GroupDispatcher');
var Constants = require('../constants/Constants');
var GroupUtils = require('../utils/GroupUtils');
var API = require('../utils/API');

//Define actions object
var GroupActions = {

	fetchAndSetNotifs: function(group) {
		var self = this;
		API.getNotifs(group, function(obj) {
			if(!obj.error) {
				console.log('NOTFS');
				console.log(obj);
				GroupDispatcher.handleAction({
					actionType: Constants.SET_NOTIFS,
					notifs: obj.notifs
				});
			} else {
				self.displaySnackMessage("Error: Could not get notifications");
			}
		});
	},

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
					console.log('getGroup.error: ' + result.error);
					self.displaySnackMessage("Error: Could not find group");
				} else {
					// set the group:
					var group = result.group
					self._setGroup(group);
				}
		});

		API.getUserInfo(function(obj) {
			if(!obj.error) {

				self._setUser(obj.user);
			} else {
				self.displaySnackMessage("Error: Could not get current user")
			}
		});
	},

	// ========================= SEGS ==========================================

	_setContentLoading: function(isLoading) {
		GroupDispatcher.handleAction({
				actionType: Constants.SET_CONTENT_LOADING,
				isLoading: isLoading
		});
	},

	_setFeedLoading: function(isLoading) {
		GroupDispatcher.handleAction({
				actionType: Constants.SET_FEED_LOADING,
				isLoading: isLoading
		});
	},

	_setChatLoading: function(isLoading) {
		GroupDispatcher.handleAction({
				actionType: Constants.SET_CHAT_LOADING,
				isLoading: isLoading
		});
	},

	// fetches the articleList seg.
	// adds to the contentStore.
	fetchArticleListSegment: function(groupId, start, count) {
		this._setContentLoading(true);
		var self = this;
		API.getArticleListSegment(groupId, start, count, function(obj) {
				if (!obj.error) {
					self._setContentLoading(false);
					GroupDispatcher.handleAction({
							actionType: Constants.ADD_ARTICLE_LIST_SEGMENT,
							articles: obj.articles
					});
				}
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

	fetchFeedSegment: function(groupId, start, count) {
		this._setFeedLoading(true);
		var self = this;
		API.getFeedSegment(groupId, start, count, function(obj) {
				if (!obj.error) {
					self._setFeedLoading(false);
					GroupDispatcher.handleAction({
							actionType: Constants.ADD_FEED_SEGMENT,
							feedPosts: obj.feedPosts
					});
				}
		});
	},


	fetch: function(groupId, start, count) {
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



	clearFeed: function() {
		GroupDispatcher.handleAction({
			actionType: Constants.CLEAR_FEED,
		});
	},

	clearArticleList: function() {
		GroupDispatcher.handleAction({
			actionType: Constants.CLEAR_ARTICLE_LIST
		});
	},

	clearChat: function() {
		GroupDispatcher.handleAction({
			actionType: Constants.CLEAR_CHAT
		});
	},

	// =========================================================================

	_setContentIsParsing: function(isParsing) {
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
					self._setContentIsParsing(false);
					self.displaySnackMessage("Error: Could not add article");
					return;
				}
				console.log('ADD ARTICLE RETURNED! ' + data.article.title);
				self._addArticle(data.article);
				self._setContentIsParsing(false);
				self.displaySnackMessage("Article Added");
		});
	},

	addFeedObject: function(obj) {

	},

	addNote: function(highlightId, note) {
		GroupDispatcher.handleAction({
				actionType: Constants.ADD_NOTE,
				note: note,
				highlightId: highlightId
		});

		API.addNoteForHighlight(note, highlightId, function(obj) {
            if (obj.error) {
                GroupActions.displaySnackMessage("Error could not add note");
                console.log("error adding note to highlight: " + obj.error);
                return;
            }
        });
	},

	editNote: function(note, content) {
			note.content = content;
			GroupDispatcher.handleAction({
					actionType: Constants.EDIT_NOTE,
					note: note
			});
	},

	deleteNote: function(note, highlightId) {
			GroupDispatcher.handleAction({
				actionType: Constants.DELETE_NOTE,
				note: note,
				highlightId: highlightId
			});
	},

	addNotif: function(notif) {
		GroupDispatcher.handleAction({
			actionType: Constants.ADD_NOTIF,
			notif: notif
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
			console.log('incrementFeedNotifs');
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
		this.addToChat(chat);
	},

	displaySnackMessage: function(message) {
		GroupDispatcher.handleAction({
			actionType: Constants.SET_SNACKBAR_MESSAGE,
			message: message
		})
	},

	// ================================== FRIENDS ======================================

    _setFriendsLoading: function(isLoading) {
        GroupDispatcher.handleAction({
            actionType: Constants.SET_FRIENDS_LOADING,
            isLoading: isLoading
        });
    },

    _setFriends: function(friends) {
        GroupDispatcher.handleAction({
            actionType: Constants.SET_FRIENDS,
            friends: friends
        });
    },

    fetchAndSetFriends: function() {
        this._setFriendsLoading(true);
        var self = this;
        API.getFriends(function(obj) {
            if(!obj.error) {
                self._setFriendsLoading(false);
                self._setFriends(obj.friends);
            }
        });
    },

    addMembers: function(groupId, memberList) {
    	GroupDispatcher.handleAction({
            actionType: Constants.ADD_MEMBER,
            members: memberList
        });

    	var memberIdList = [];
        for (var i = 0; i < memberList.length; i++) {
        	memberIdList.push(memberList[i].facebook.id);
        }

        API.addMembers(groupId, memberIdList, function() {
			// do nothing.
        });
    },

    //=================================== CHAT =======================================================

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

module.exports = GroupActions;
