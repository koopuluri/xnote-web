var Dispatcher = require('../dispatcher/LandingDispatcher');
var Constants = require('../constants/Constants');
var API = require('../utils/API');

//Define actions object
var Actions = {

	_setLoading: function(isLoading) {
		Dispatcher.handleAction({
			actionType: Constants.SET_LOADING,
			isLoading: isLoading
		});
	},

	_setGroup: function(group) {
		Dispatcher.handleAction({
			actionType: Constants.SET_GROUP,
			group: group
		});
	},

	fetchAndSetGroup: function(groupId) {
		var self = this;
		self._setLoading(true);
		API.getGroup(groupId, function(result) {
			if (result.error) {
				self._setLoading(false);
				// !?!?
			} else {
				// set the group:
				var group = result.group;
				self._setGroup(group);
				self._setLoading(false);
			}
		});
	},
}

module.exports = Actions;