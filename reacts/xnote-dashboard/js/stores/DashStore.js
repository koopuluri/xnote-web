var Dispatcher = require('../dispatcher/Dispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var _ = require('underscore');

var CHANGE_EVENT = 'dashChange';

_groups = [];
_user = null;
_friends = [];
_isLoading = false;

var DashStore = _.extend({}, EventEmitter.prototype, {

    getGroups: function() {
        return _groups;
    },

    getLoading: function() {
        return _isLoading;
    },

    getCurrentUser: function() {
        return _user;
    },

    getFriends: function() {
        return _friends;
    },

  	emitChange:function(){
  		this.emit(CHANGE_EVENT)
  	},

  	addChangeListener:function(callback) {
  		this.on(CHANGE_EVENT, callback)
  	},

  	removeChangeListener:function(callback) {
  		this.removeListener(CHANGE_EVENT, callback)
  	},
});

Dispatcher.register(function(payload) {
	var action = payload.action;
	switch(action.actionType) {

		case Constants.SET_GROUPS:
        _groups = action.groups;
        break;

    case Constants.SET_LOADING:
       _isLoading = action.isLoading;
       break;
    
    case Constants.SET_FRIENDS:
        _friends = action.friends;
        break;

    case Constants.SET_USER_INFO:
        _user = action.userInfo;
        break;

    case Constants.ADD_GROUP:
        _groups.unshift(action.group);
        break;

	}
	DashStore.emitChange();
	return true;
});

module.exports = DashStore;
