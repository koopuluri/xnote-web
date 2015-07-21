var Dispatcher = require('../dispatcher/LoginSignUpDispatcher');
var Constants = require('../constants/Constants');
var API = require('../utils/API');

var Actions = {

    _setLoading: function(isLoading) {
        Dispatcher.handleAction({
            actionType: Constants.SET_LOADING,
            isLoading: isLoading
        });
    },

    _setGroups: function(groups) {
        Dispatcher.handleAction({
            actionType: Constants.SET_GROUPS,
            groups: groups
        });
    },

    _setUserInfo: function(userInfo) {
        Dispatcher.handleAction({
            actionType: Constants.SET_USER_INFO,
            userInfo: userInfo
        });
    },

    _setFriends: function(friends) {
        Dispatcher.handleAction({
            actionType: Constants.SET_FRIENDS,
            friends: friends
        });
    },

    // fetching and setting the groups for this user:
    // first set the group loading for the store:
    fetchAndSetGroups: function() {
        var self = this;
        this._setLoading(true);
        API.getGroups(function(groups) {
            self._setGroups(groups);
            self._setLoading(false);
        });
    },

    fetchAndSetUser: function() {
        var self = this;
        API.getUserInfo(function(data) {
            self._setUserInfo(data.user);
        });
    },

    fetchAndSetFriends: function() {
        var self = this;
        API.getFriends(function(friends) {
            self._setFriends(friends);
        })
    },

    // ========================== FEED ===========================================

    fetchFeedSegment: function(groupId, start, count) {
        var _setFeedLoading = function(isLoading) {
            Dispatcher.handleAction({
                    actionType: Constants.SET_FEED_LOADING,
                    isLoading: isLoading
            });
        }; 

        _setFeedLoading(true);
        var self = this;
        API.getFeedSegment(start, count, function(obj) {
                if (!obj.error) {
                    _setFeedLoading(false);
                    Dispatcher.handleAction({
                            actionType: Constants.ADD_FEED_SEGMENT,
                            feedPosts: obj.feedPosts
                    });
                }
        });
    },

    clearFeed: function() {
        Dispatcher.handleAction({
            actionType: Constants.CLEAR_FEED,
            feedPosts: obj.feedPosts
        });
    },

    addNote: function(highlightId, note) {
        Dispatcher.handleAction({
            actionType: Constants.ADD_NOTE,
            note: note,
            highlightId: highlightId
        });

        API.addNoteForHighlight(note, highlightId, function() {
            // do nothing..
        });
    },  

    removeNote: function(note, highlightId) {
    },

    // adding a group:
    // - add to store.
    // - add to the db.
    addGroup: function(groupObj, members) {
        // adding to the store:
        Dispatcher.handleAction({
            actionType: Constants.ADD_GROUP,
            group: groupObj,
            members: members
        });

        API.addGroup(groupObj, members, function() {
            // callback does nothing?
        });
    },
}

module.exports = Actions;
