var GroupDispatcher = require('../dispatcher/GroupDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var _ = require('underscore');

var _articleList = [];
var _selectedArticle = null;

var CHANGE = 'contentStoreChange';

var ContentStore = _.extend({}, EventEmitter.prototype, {

  	getArticleList: function() {
        return _articleList;
    },

    getSelectedArticle: function() {
        return _selectedArticle;
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

    case Constants.SELECT_ARTICLE:
        _selectedArticle = action.article;
        break;

    case Constants.UNSELECT_ARTICLE:
        _selectedArticle = null;
        break;

		default:
			return true;
	}
	ContentStore.emitChange();
	return true;
})

module.exports = ContentStore;
