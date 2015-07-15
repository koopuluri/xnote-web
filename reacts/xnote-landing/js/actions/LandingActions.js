var LandingDispatcher = require('../dispatcher/LandingDispatcher');
var Constants = require('../constants/Constants');
var API = require('../utils/API');

//Define actions object
var Actions = {

	_setGroup: function(group) {
		GroupDispatcher.handleAction({
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

	_setInviter: function(inviter) {
		GroupDispatcher.handleAction({
			actionType: Constants.SET_INVITER,
			inviter: inviter
		});
	},

	fetchAndSetInviter: function(inviterId) {
		var self = this;
		API.getInviter(inviterId, function(result) {
			if (result.error) {
			} else {
				// set the inviter:
				var inviter = result.inviter
				self._setInviter(inviter);
			}
		});
	},
}

module.exports = Actions;