var GroupDispatcher = require('../dispatcher/GroupDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var _ = require('underscore');

var _articleList = [];
var _selectedArticle = null;
var _selectedArticleId = null;

var CHANGE = 'contentStoreChange';

var ContentStore = _.extend({}, EventEmitter.prototype, {

  	getArticleList: function() {
        return _articleList;
    },

    getSelectedArticle: function() {
        return _selectedArticle;
    },

    getSelectedArticleId: function() {
        return _selectedArticleId;
    },

    getLoading: function() {
        return false;
    },

    getParsing: function() {
        return false;
    },

  	//emit change event
  	emitChange: function() {
  		this.emit(CHANGE);
  	},

  	//Add change listener
  	addChangeListener: function(callback) {
  		this.on(CHANGE, callback);
  	},

  	removeChangeListener: function(callback) {
  		this.removeListener(CHANGE, callback);
  	}
});

GroupDispatcher.register(function(payload) {
	var action = payload.action;
	switch(action.actionType) {

		case Constants.SET_ARTICLE_LIST:
  			_articleList = action.articleList;
  			break;

    case Constants.ADD_ARTICLE:
        _articleList.push(action.article);
        break;

    case Constants.SET_SELECTED_ARTICLE:
        _selectedArticle = action.article;
        break;

    case Constants.SET_SELECTED_ARTICLE_ID:
        _selectedArticleId = action.articleId;
        console.log('selectedArticleId set!' + action.articleId);
        break;

		default:
			return true;
	}

	ContentStore.emitChange();
	return true;
})

module.exports = ContentStore;
