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
        console.log('fetchAndSetArticle: ' + articleId);
        var self = this;
        API.getArticle(articleId, function(data) {
            if (data.error) {
                console.log('fetchAndSetArticle error!');
                self._setSelectedArticleId(null);  // turning off the loading.
                return;
            }
            // got article:
            console.log('got article! ' + Object.keys(data.article));
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
        console.log('fetch and set highlight ' + highlightId);
        var self = this;
        // API.getHighlight(highlightId, function(obj) {
        //     if (obj.error) {
        //         console.log('fetchAndSetHighlight errored!');
        //         self._setDiscussionLoading(false);
        //         return;
        //     }
        //
        //     // got highlight:
        //     self._setHighlight(obj.highlight);
        // });
    },

    deleteNote: function(highlightId, noteId) {
        console.log('deleteNote: ' + highlightId);
    },

    addNote: function(highlightId, note) {
        console.log('addNOte(): ' + highlightId);
        GroupDispatcher.handleAction({
            actionType: Constants.DISCUSSION_ADD_NOTE,
            highlightId: highlightId,
            note: note
        });
        // API.addNoteToHighlight(note, highlightId, function(obj) {
        //     if (obj.error) {
        //         console.log("error adding note to highlight: " + obj.error);
        //         return;
        //     }
        //
        //     // added successfuly:
        //     console.log('note succcessfuly added to highlight! ' + note.content);
        // });
    },

    // set the highlight in the discussionView
    // make api call to persist highlight on db.
    addHighlight: function(highlight) {
        this._setDiscussionLoading(false);
        this.setHighlight(highlight);
        this.setPartialHighlight(highlight.highlightId);
        // API.addHighlight(highlight, function(obj) {
        //     if (obj.error) {
        //         console.log('adding highlight error: ' + obj.error);
        //     }
        // });
    },
};

module.exports = Actions;
