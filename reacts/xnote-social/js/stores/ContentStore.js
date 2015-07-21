var GroupDispatcher = require('../dispatcher/GroupDispatcher');
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

var ContentStore = _.extend({}, EventEmitter.prototype, {

    getIndex: function() {
        return _index;
    },

    isLazy: function() {
      return _isLazy;
    },

  	getArticleList: function() {
        return _articleList;
    },

    getParsing: function() {
        return _isParsing;
    },

    getSelectedArticle: function() {
        return _selectedArticle;
    },

    getSelectedArticleId: function() {
        return _selectedArticleId;
    },

    getLoading: function() {
        return _isLoading;
    },

    emitArticleIdChange: function() {
        this.emit(ARTICLE_ID_CHANGE);
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

GroupDispatcher.register(function(payload) {
  	var action = payload.action;
  	switch(action.actionType) {

      case Constants.CONTENT_SET_PARSING:
          _isParsing = action.isParsing;
          break;

      case Constants.SET_CONTENT_LOADING:
          _isLoading = action.isLoading;
          break;

  		case Constants.SET_ARTICLE_LIST:
    			_articleList = action.articleList.reverse();
    			break;

      case Constants.CONTENT_ADD_ARTICLE:
          _articleList.unshift(action.article);
          break;

      case Constants.SET_SELECTED_ARTICLE:
          _selectedArticle = action.article;
          break;

      case Constants.SET_SELECTED_ARTICLE_ID:
          _selectedArticleId = action.articleId;
          ContentStore.emitArticleIdChange();
          return true;

      case Constants.ADD_ARTICLE_LIST_SEGMENT:
          var articles = action.articles;
          if (articles) {
              _articleList = _articleList.concat(articles);
              _index += articles.length;
          }

          if (articles.length < SEG_SIZE) {
              // need to stop lazy loading, reached limit:
              _isLazy = false;
          }

          break;

      case Constants.CLEAR_ARTICLE_LIST:
          _articleList = [];
          _index = 0;
          break;

  		default:
  			return true;
  	}

  	ContentStore.emitChange();
  	return true;
})

module.exports = ContentStore;
