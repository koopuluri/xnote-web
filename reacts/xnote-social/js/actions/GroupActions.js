var GroupDispatcher = require('../dispatcher/GroupDispatcher');
var Constants = require('../constants/Constants');
var GroupUtils = require('../utils/GroupUtils');
var API = require('../utils/API');

//Define actions object
var GroupActions = {

	// reset notifCount to 0.
	// make a call to server to set latest notifs viewed tstamp to NOW().	
	notifsViewed: function(groupId) {
		GroupDispatcher.handleAction({
			actionType: Constants.NOTIFS_VIEWED,
		});

		API.notifsViewed(groupId, function(obj) {
			// do nothing.
		});
	},

	fetchAndSetNotifs: function(group) {
		var self = this;
		API.getNotifs(group, function(obj) {
			if(!obj.error) {
				var notifs = obj.notifs;
				console.log('NOTIFS RECEIVED');
				console.log(notifs);
				var lastViewed = obj.lastViewed;
				GroupDispatcher.handleAction({
					actionType: Constants.SET_NOTIFS,
					notifs: notifs,
					lastViewed: lastViewed
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



	fetchAndSetGroup: function(groupId) {
		var self = this;
		API.getGroup(groupId, function(result) {
			if (result.error) {
				self.displaySnackMessage("Error: Could not find group");
			} else {
				// set the group:
				self._setGroup(result.group);
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

	fetchFeedSegment: function(groupId, start, count) {
		var _setFeedLoading = function(isLoading) {
			GroupDispatcher.handleAction({
					actionType: Constants.SET_FEED_LOADING,
					isLoading: isLoading
			});
		};

		
		_setFeedLoading(true);
		var self = this;
		console.log('fetchFeedSegment: ' + start + '::' + count);
		API.getFeedSegment(groupId, start, count, function(obj) {
				if (!obj.error) {
					_setFeedLoading(false);
					var feedPosts = obj.feedPosts;
					console.log('feedPosts: ' + feedPosts.length);
					GroupDispatcher.handleAction({
							actionType: Constants.ADD_FEED_SEGMENT,
							feedPosts: feedPosts
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
}

module.exports = GroupActions;
