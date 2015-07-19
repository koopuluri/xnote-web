var GroupDispatcher = require('../dispatcher/Dispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var _ = require('underscore');

var _articleList = [];
var _selectedArticle = null;
var _selectedArticleId = null;
var _isParsing = false;
var _isLoading =true;

var _isLazy = true;

var SEG_SIZE = 10;

var _index = 0;

var CHANGE = 'contentStoreChange';
var ARTICLE_ID_CHANGE = 'contentArticleIdChange';

var ArticleStore = _.extend({}, EventEmitter.prototype, {

    getSelectedArticle: function() {
        return _selectedArticle;
    },

    getSelectedArticleId: function() {
        return _selectedArticleId;
    },

    getLoading: function() {
        return _isLoading;
    },

    addArticleIdChangeListener: function(callback) {
        this.on(ARTICLE_ID_CHANGE, callback);
    },

    removeArticleIdChangeListener: function(callback) {
        this.removeListener(ARTICLE_ID_CHANGE, callback);
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

Dispatcher.register(function(payload) {
  	var action = payload.action;
  	switch(action.actionType) {

      case Constants.SET_CONTENT_LOADING:
          _isLoading = action.isLoading;
          break;

      case Constants.SET_SELECTED_ARTICLE:
          _selectedArticle = action.article;
          break;
          
  		default:
  			return true;
  	}

  	ArticleStore.emitChange();
  	return true;
})

module.exports = ArticleStore;
