var GroupDispatcher = require('../dispatcher/GroupDispatcher');
var EventEmitter = require('events').EventEmitter;
var GroupConstants = require('../constants/Constants');
var _ = require('underscore');

var _group = {};
var _user = {facebook: {name: 'Karthik Uppuluri', id: 'dkl;ajkl;dfj;'}};


var GroupStore = _.extend({}, EventEmitter.prototype, {

  	//Get chat items
  	getGroupMembers: function() {
        return _group.members;
    },

    getGroupTitle: function() {
        return _group.title;
    },

    getCurrentUser: function() {
        return _user;
    },

    getGroupId: function() {
        return _group.groupId;
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

GroupDispatcher.register(function(payload) {
	var action = payload.action;
	switch(action.actionType) {

		case GroupConstants.SET_GROUP:
  			_group = action.group;
  			break;

    case GroupConstants.SET_GROUP_TITLE:
        _group.title = action.title;
        break;

    case GroupConstants.SET_USER:
        _user = action.user;
        break;

		default:
			return true;
	}
	GroupStore.emitChange();
	return true;
})

module.exports = GroupStore;
