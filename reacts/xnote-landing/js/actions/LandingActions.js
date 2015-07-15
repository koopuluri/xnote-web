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
				console.log('getGroup.error: ' + result.error);
			} else {
				// set the group:
				console.log('RESULT');
				console.log(result);
				var group = result.group
				self._setGroup(group);
			}
		});
	},

	_setInviter: function(inviter) {
		Dispatcher.handleAction({
			actionType: Constants.SET_INVITER,
			inviter: inviter
		});
	},
}

module.exports = Actions;