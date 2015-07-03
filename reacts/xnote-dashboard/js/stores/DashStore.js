var AppDispatcher = require('../dispatcher/LoginSignUpDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var _ = require('underscore');

var CHANGE_EVENT = 'dashChange';

_groups = [];
_isLoading = false;

var DashStore = _.extend({}, EventEmitter.prototype, {

    getGroups: function() {
        return _groups;
    },

    getLoading: function() {
        return _isLoading;
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

AppDispatcher.register(function(payload) {
	var action = payload.action;
	switch(action.actionType) {

		case Constants.SET_GROUPS:
			 _groups = action.groups;
			 break;

    case Constants.SET_LOADING:
       _isLoading = action.isLoading;
       break;

    case Constants.ADD_GROUP:
        _groups.push(action.group);
        break;

	}
	DashStore.emitChange();
	return true;
});

module.exports = DashStore;
