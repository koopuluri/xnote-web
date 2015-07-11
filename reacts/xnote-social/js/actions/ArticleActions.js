var GroupDispatcher = require('../dispatcher/GroupDispatcher');
var Constants = require('../constants/Constants');
var API = require('../utils/API');

var Actions = {

    _setSelectedArticle: function(article) {
        GroupDispatcher.handleAction({
            actionType: Constants.SET_SELECTED_ARTICLE,
            article: article
        });
    },

    unselectArticle: function() {
        GroupDispatcher.handleAction({
            actionType: Constants.CLEAR_DISCUSSION,
        });
        this._setSelectedArticle(null);
        this._setSelectedArticleId(null);
    },

    _setSelectedArticleId: function(articleId) {
        console.log('_setSelectedArticleId: ' + articleId);
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
                return;
            }

            // got highlight:
            self._setDiscussionLoading(false);
            self.setHighlight(obj.highlight);
        });
    },

    deleteNote: function(highlightId, noteId) {
    },

    addNote: function(highlightId, note) {
        GroupDispatcher.handleAction({
            actionType: Constants.DISCUSSION_ADD_NOTE,
            highlightId: highlightId,
            note: note
        });

        API.addNoteForHighlight(note, highlightId, function(obj) {
            if (obj.error) {
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
                
            }
        });
    },
};

module.exports = Actions;
