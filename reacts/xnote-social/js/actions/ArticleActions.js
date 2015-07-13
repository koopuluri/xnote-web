var GroupDispatcher = require('../dispatcher/GroupDispatcher');
var Constants = require('../constants/Constants');
var GroupActions = require('../actions/GroupActions');
var API = require('../utils/API');

var Actions = {

    _setSelectedArticle: function(article) {
        GroupDispatcher.handleAction({
            actionType: Constants.SET_SELECTED_ARTICLE,
            article: article
        });
    },

    // selects the article. If highlightId provided, it will be selected, 
    // and when article content rendered, it will scroll to the highlight 
    // associated with the highlightId provided.
    // selectArticle: function(articleId, highlightId) {
    //     if (highlightId) {
    //         // setting the highlightId for the Discussion and PartialHighlight components:
    //         this.setHighlight(highlightId);
    //         this.setPartialHighlight(highlightId);
    //     }

    //     // now time to set the articleView: 
    //     this._setSelectedArticleId(articleId);
    // },


    unselectArticle: function() {
        GroupDispatcher.handleAction({
            actionType: Constants.CLEAR_DISCUSSION,
        });
        this._setSelectedArticle(null);
        this._setSelectedArticleId(null);
    },

    _setSelectedArticleId: function(articleId) {
        GroupDispatcher.handleAction({
            actionType: Constants.SET_SELECTED_ARTICLE_ID,
            articleId: articleId
        });
    },

    _setContentLoading: function(isLoading) {
        GroupDispatcher.handleAction({
            actionType: Constants.SET_CONTENT_LOADING,
            isLoading: isLoading
        });
    },

    fetchAndSetArticle: function(articleId) {
        var self = this;
        API.getArticle(articleId, function(data) {
            if (data.error) {
                console.log('fetchAndSetArticle error!');
                GroupActions.displaySnackMessage("Error could not fetch article");
                self._setSelectedArticleId(null);  // turning off the loading.
                return;
            }
            // got article:
            self._setSelectedArticle(data.article);
        });
    },

    // ============================= HIGHLIGHT =================================

    _setDiscussionLoading: function(isLoading) {
        GroupDispatcher.handleAction({
            actionType: Constants.SET_DISCUSSION_LOADING,
            isLoading: isLoading
        });
    },

    setHighlight: function(highlight) {
        
        GroupDispatcher.handleAction({
            actionType: Constants.SET_DISCUSSION_HIGHLIGHT,
            highlight: highlight
        });
    },

    setPartialHighlight: function(highlightId) {
        GroupDispatcher.handleAction({
            actionType: Constants.SET_SELECT_PARTIAL_HIGHLIGHT,
            highlightId: highlightId
        });
    },

    hoverHighlight: function(highlightId) {
        GroupDispatcher.handleAction({
            actionType: Constants.SET_HOVER_HIGHLIGHT,
            highlightId: highlightId
        });
    },

    fetchAndSetHighlight: function(highlightId) {
        this._setDiscussionLoading(true);
        this.setPartialHighlight(highlightId);
        var self = this;
        API.getHighlight(highlightId, function(obj) {
            if (obj.error) {
                self._setDiscussionLoading(false);
                GroupActions.displaySnackMessage("Error could not fetch highlight");
                return;
            }

            // got highlight:
            self._setDiscussionLoading(false);
            self.setHighlight(obj.highlight);
        });
    },

    deleteNote: function(payload) {
    },

    addNote: function(highlightId, note) {
        GroupDispatcher.handleAction({
            actionType: Constants.DISCUSSION_ADD_NOTE,
            highlightId: highlightId,
            note: note
        });

        API.addNoteForHighlight(note, highlightId, function(obj) {
            if (obj.error) {
                GroupActions.displaySnackMessage("Error could not add note");
                console.log("error adding note to highlight: " + obj.error);
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
        this.setPartialHighlight(highlight.highlightId);
        API.addHighlightForArticle(highlight, newSerialization, function(obj) {
            if (obj.error) {
                GroupActions.displaySnackMessage("Error could not add highlight");
            }
        });
    },

    _setFriendsLoading: function(isLoading) {
        GroupDispatcher.handleAction({
            actionType: Constants.SET_FRIENDS_LOADING,
            isLoading: isLoading
        });
    },

    _setFriends: function(friends) {
        GroupDispatcher.handleAction({
            actionType: Constants.SET_FRIENDS_LOADING,
            friends: friends
        });
    },

    fetchAndSetFriends: function() {
        this._setFriendsLoading(true);
        API.getFriends(function(obj) {
            if(!obj.error) {
                this._setFriendsLoading(false);
                this._setFriends(obj.friends);
            }
        });
    },
};

module.exports = Actions;










