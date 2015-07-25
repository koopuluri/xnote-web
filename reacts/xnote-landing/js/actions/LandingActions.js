var Dispatcher = require('../dispatcher/LandingDispatcher');
var Constants = require('../constants/Constants');
var API = require('../utils/API');
var Utils = require('../utils/Utils');

//Define actions object
var Actions = {

	signup: function(name, email, password) {
		var self = this;
		API.signup(name, email, password, function(obj) {
			if (obj.error) {
				self._setError(obj.error);
			} else {
				var redirectUrl = obj.redirect;
				window.location = redirectUrl;
			}
		});
	},

	login: function(email, password) {
		var self = this;
		API.login(email, password, function(obj) {
			console.log(obj);
			if (obj.error) {
				self._setError(obj.error);
			} else {
				var redirectUrl = obj.redirect;
				window.location = redirectUrl;
			}
		});
	},

	loginFacebook: function() {
		var self = this;
		console.log('facebook login!');
		API.loginFacebook(function(obj) {
			if (obj.error) {
				self._setError(obj.error);
			} else {
				// do nothing.
			}
		});
	},

	loginGoogle: function() {
		var self = this;
		console.log('google login');
		API.loginGoogle(function(obj) {
			if (obj.error) {
				self._setError(obj.error);
			} else {
				// do nothing.
			}
		});
	},

	_setError: function(error) {
		Dispatcher.handleAction({
			actionType: Constants.SET_ERROR,
			error: error
		});
	},

	_setLoading: function(isLoading) {
		Dispatcher.handleAction({
			actionType: Constants.SET_LOADING,
			isLoading: isLoading
		});
	},

	_setGroup: function(group) {
		for(var i = 0; i < group.members.length; i++) {
			console.log('group members: ' + group.members[i]);
			console.log(group.members[i]);
			group.members[i] = Utils.normalizeUser(group.members[i]);
		}
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