var Dispatcher = require('../dispatcher/Dispatcher');
var Constants = require('../constants/Constants');
var API = require('../utils/API');
var Utils = require('../utils/NoteUtils');

var Actions = {

    _setArticle: function(article) {
        Dispatcher.handleAction({
            actionType: Constants.SET_ARTICLE,
            article: article
        });
    },

    _setContentLoading: function(isLoading) {
        Dispatcher.handleAction({
            actionType: Constants.SET_CONTENT_LOADING,
            isLoading: isLoading
        });
    },

    _setGroup: function(group) {
        Dispatcher.handleAction({
            actionType: Constants.SET_GROUP,
            group: group
        });
    },

    fetchAndSetArticle: function(articleId) {
        this._setContentLoading(true);
        var self = this;
        API.getArticle(articleId, function(data) {
            if (data.error) {
                self.displaySnackMessage("Error could not fetch article");
                self._setContentLoading(false);
                return;
            }

            // got article:
            self._setContentLoading(false);
            self._setArticle(data.article);
        });
    },

    fetchAndSetGroup: function(groupId) {
        var self = this;
        API.getGroup(groupId, function(data) {
            if (data.error) {
                self.displaySnackMessage("Error could not fetch group name");
                return;
            }

            // got group:
            self._setGroup(data.group);
        });
    },

    // ============================= HIGHLIGHT =================================

    _setDiscussionLoading: function(isLoading) {
        Dispatcher.handleAction({
            actionType: Constants.SET_DISCUSSION_LOADING,
            isLoading: isLoading
        });
    },

    setHighlight: function(highlight) {    
        Dispatcher.handleAction({
            actionType: Constants.SET_DISCUSSION_HIGHLIGHT,
            highlight: highlight
        });
    },

    setPartialHighlight: function(highlightId) {
        Dispatcher.handleAction({
            actionType: Constants.SET_SELECT_PARTIAL_HIGHLIGHT,
            highlightId: highlightId
        });
    },

    hoverHighlight: function(highlightId) {
        Dispatcher.handleAction({
            actionType: Constants.SET_HOVER_HIGHLIGHT,
            highlightId: highlightId
        });
    },

    fetchAndSetHighlight: function(highlightId) {
        this._setDiscussionLoading(true);
        this.setPartialHighlight(highlightId);

        // set the page url:

        var self = this;
        API.getHighlight(highlightId, function(obj) {
            if (obj.error) {
                self._setDiscussionLoading(false);
                self.displaySnackMessage("Error could not fetch highlight");
                return;
            }
            // got highlight:
            window.location.hash = highlightId;
            self._setDiscussionLoading(false);
            self.setHighlight(obj.highlight);
        });
    },

    deleteNote: function(note, highlightId) {
        Dispatcher.handleAction({
            actionType: Constants.DISCUSSION_DELETE_NOTE,
            highlightId: highlightId,
            note: note
        });

    },

    addNote: function(highlightId, note) {
        Dispatcher.handleAction({
            actionType: Constants.DISCUSSION_ADD_NOTE,
            highlightId: highlightId,
            note: note
        });

        var self = this;

        API.addNoteForHighlight(note, highlightId, function(obj) {
            if (obj.error) {
                self.displaySnackMessage("Error could not add note");
                return;
            }
            // added successfuly:
        });
    },

    // set the highlight in the discussionView
    // make api call to persist highlight on db.
    addHighlight: function(highlight, newSerialization) {
        this._setDiscussionLoading(false);
        this.setHighlight(highlight);
        this.setPartialHighlight(highlight._id);
        var self = this;

        var article = highlight.article;

        // checking if highlight.article is reference or the actual object:
        if (article !== null && typeof article === 'object') {
            // need to make it a ref:
            highlight.article = article._id;
        }

        API.addHighlightForArticle(highlight, newSerialization, function(obj) {
            if (obj.error) {
                self.displaySnackMessage("Error could not add highlight");
            }
        });
    },

    // ============================= NOTIF STUFF =================================

    fetchAndSetNotifs: function(group) {
        var self = this;
        API.getNotifs(group, function(obj) {
            if(!obj.error) {
                var notifs = obj.notifs;
                var lastViewed = obj.lastViewed;
                Dispatcher.handleAction({
                    actionType: Constants.SET_NOTIFS,
                    notifs: notifs,
                    lastViewed: lastViewed
                });
            } else {
                self.displaySnackMessage("Error: Could not get notifications");
            }
        });
    },

    addNotif: function(notif) {
        Dispatcher.handleAction({
            actionType: Constants.ADD_NOTIF,
            notif: notif
        });
    },

    notifsViewed: function(groupId) {
        Dispatcher.handleAction({
            actionType: Constants.NOTIFS_VIEWED,
        });

        API.notifsViewed(groupId, function(obj) {
            // do nothing.
        });
    },

    socketReceiveNote: function(note, highlightId, postNotifCount) {
        Dispatcher.handleAction({
            actionType: Constants.SOCKET_RECEIVE_NOTE,
            note: note,
            highlightId: highlightId,
        });
    },

    //============================================================================
    displaySnackMessage: function(message) {
        
    }
};

module.exports = Actions;