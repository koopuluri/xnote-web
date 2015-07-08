var GroupDispatcher = require('../dispatcher/GroupDispatcher');
var EventEmitter = require('events').EventEmitter;
var GroupConstants = require('../constants/Constants');
var _ = require('underscore');

var _viewMode = GroupConstants.SIDEBAR_CHAT_VIEW;

//Method to add a note to a post
function toggleViewMode(data) {
	_viewMode = data;
}

var SidebarStore = _.extend({}, EventEmitter.prototype, {

	//Return posts
	getViewMode: function() {
		return _viewMode;
	},

	//Emit Change event
	emitChange: function() {
		this.emit('change');
	},

	//Add change listener
	addChangeListener: function(callback) {
		this.on('change', callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	}
});

GroupDispatcher.register(function(payload) {
	var action = payload.action;

	switch(action.actionType) {
		case GroupConstants.SET_VIEW_MODE:
			toggleViewMode(action.data);
			break;

		default:
			return true;

	}
	SidebarStore.emitChange();
	return true;
});

module.exports = SidebarStore;
