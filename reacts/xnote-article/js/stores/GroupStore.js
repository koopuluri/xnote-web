var Dispatcher = require('../dispatcher/Dispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var _ = require('underscore');

var _group = {};
var _user = null;

var _friends = [];


var GroupStore = _.extend({}, EventEmitter.prototype, {

    getGroupTitle: function() {
        return _group.title;
    },

    getCurrentUser: function() {
        return _user;
    },

    getGroupId: function() {
        return _group._id;
    },

    getCurrentUser: function() {
        return _user;
    },

  	//emit change event
  	emitChange: function() {
  		this.emit('groupChange');
  	},

  	//Add change listener
  	addChangeListener: function(callback) {
  		this.on('groupChange', callback);
  	},

  	removeChangeListener: function(callback) {
  		this.removeListener('groupChange', callback);
  	}
});

Dispatcher.register(function(payload) {
	var action = payload.action;
	switch(action.actionType) {

		case Constants.SET_GROUP:
  			_group = action.group;
  			break;

    case Constants.SET_USER:
        _user = action.user;
        break;

		default:
			return true;

	}
	GroupStore.emitChange();
	return true;
})

module.exports = GroupStore;
