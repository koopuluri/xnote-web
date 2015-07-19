var GroupDispatcher = require('../dispatcher/GroupDispatcher');
var EventEmitter = require('events').EventEmitter;
var GroupConstants = require('../constants/Constants');
var _ = require('underscore');

var _loading = true;

var _friends = []

var CHANGE = 'friendsChange';


var FriendStore = _.extend({}, EventEmitter.prototype, {

    getFriends: function() {
        return _friends;
    },

    getLoading: function() {
        return _loading;
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

		case GroupConstants.SET_FRIENDS:
  			_friends = action.friends;
  			break;

    case GroupConstants.SET_FRIENDS_LOADING:
        _loading = action.isLoading;
        break;

		default:
			return true;
	}
	FriendStore.emitChange();
	return true;
})

module.exports = FriendStore;
