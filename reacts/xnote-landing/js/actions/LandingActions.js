var Dispatcher = require('../dispatcher/LandingDispatcher');
var Constants = require('../constants/Constants');
var API = require('../utils/API');

//Define actions object
var Actions = {

	_setGroup: function(group) {
		Dispatcher.handleAction({
			actionType: Constants.SET_GROUP,
			group: group
		});
	},

	fetchAndSetGroup: function(groupId) {
		var self = this;
		API.getGroup(groupId, function(result) {
			if (result.error) {
			} else {
				// set the group:
				var group = result.group
				self._setGroup(group);
			}
		});
	},
}

module.exports = Actions;