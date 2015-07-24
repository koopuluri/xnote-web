var Dispatcher = require('../dispatcher/LandingDispatcher');
var Constants = require('../constants/Constants');
var API = require('../utils/API');

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
		API.loginFacebook(function(obj) {
			if (obj.error) {
				self._setError(obj.error);
			} else {
				var redirectUrl = obj.redirect;
				window.location = redirectUrl;
			}
		});
	},

	loginGoogle: function() {
		API.loginGoogle(function(obj) {
			if (obj.error) {
				self._setError(obj.error);
			} else {
				var redirectUrl = obj.redirect;
				window.location = redirectUrl;
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