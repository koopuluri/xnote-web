var GroupDispatcher = require('../../../dispatcher/GroupDispatcher');
var Constants = require('../../../constants/Constants');
var API = require('../../../utils/API');

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

    _setHighlight: function(highlight) {
        GroupDispatcher.handleAction({
            actionType: Constants.SET_DISCUSSION_HIGHLIGHT,
            highlight: highlight
        });
    },

    fetchAndSetHighlight: function(highlightId) {
        this._setDiscussionLoading(true);
        var self = this;
        API.getHighlight(highlightId, function(obj) {
            if (obj.error) {
                console.log('fetchAndSetHighlight errored!');
                self._setDiscussionLoading(false);
                return;
            }

            // got highlight:
            self._setHighlight(obj.highlight);
        });
    },

    addNoteToHighlight: function(note, highlightId) {
        API.addNoteToHighlight(note, highlightId, function(obj) {
            if (obj.error) {
                console.log("error adding note to highlight: " + obj.error);
                return;
            }

            // added successfuly:
            console.log('note succcessfuly added to highlight! ' + note.content);
        });
    },

    addHighlight: function(highlight) {
        API.addHighlight(highlight, function(obj) {
            if (obj.error) {
                console.log('adding highlight error: ' + obj.error);
            }
        });
    },
};

module.exports = Actions;










''
