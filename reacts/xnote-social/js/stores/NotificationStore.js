var GroupDispatcher = require('../dispatcher/GroupDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var Utils = require('../utils/GroupUtils');
var _ = require('underscore');

//TODO: Remove dummy chat and feed notification values

var _chatNotifs = 0;
var _feedNotifs = 0;
var _notifs = []
var _count = 0;
var _lastViewed = 0;

// expects to get notifs sorted by timestamp (desc) ==> newest one first!
function getCount(notifs, lastViewed) {
	var count = 0;
	for (var i = 0; i < notifs.length; i++) {
		var notif = notifs[i];
		var notifTstamp = new Date(notifs[i].createdAt).getTime();
		// now comparing the tstamps:
		if (notifTstamp > lastViewed) {
			count++;
		} else {
			// means this notif already seen!
			return count;
		}
	}

	return count;
}

function loadChatNotifs(data) {
	_chatNotifs = data;
}

function loadFeedNotifs(data) {
	_feedNotifs = data;
}

function resetChatNotifs() {
	_chatNotifs = 0;
}

function resetFeedNotifs() {
	_feedNotifs = 0;
}

var NotificationStore = _.extend({}, EventEmitter.prototype, {

	getUnviewedCount: function() {
		return _count;
	},

	getChatNotifs: function() {
		return _chatNotifs;
	},

	getFeedNotifs: function() {
		return _feedNotifs;
	},

	getNotifs: function() {
		return _notifs;
	},

	//emit change event
	emitChange: function() {
		this.emit('notification-change');
	},

	//Add change listener
	addChangeListener: function(callback) {
		this.on('notification-change', callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener('notification-change', callback);
	}
});

GroupDispatcher.register(function(payload) {
	var action = payload.action;
	switch(action.actionType) {

		case Constants.RECEIVE_CHAT_NOTIFS:
			loadChatNotifs(action.data);
			break;

		case Constants.RECEIVE_FEED_NOTIFS:
			loadFeedNotifs(action.data);
			break;

		case Constants.RESET_CHAT_NOTIFS:
			resetChatNotifs();
			break;

		case Constants.RESET_FEED_NOTIFS:
			resetFeedNotifs();
			break;

		case Constants.SET_NOTIFS:
			for(var i = 0; i < action.notifs.length; i++) {
				if(action.notifs[i].article) {
					var article = action.notifs[i].article;
					var createdBy = Utils.normalizeUser(article.createdBy);
					article.createdBy = createdBy;
				} else if(action.notifs[i].highlight) {
					var highlight = action.notifs[i].highlight;
					var createdBy = Utils.normalizeUser(highlight.createdBy);
					highlight.createdBy = createdBy;
				}
			}
			_lastViewed = new Date(action.lastViewed).getTime();
			_notifs = action.notifs;
			_count = getCount(_notifs, _lastViewed);
			break;

		case Constants.ADD_NOTIF:
			if(action.notif.article) {
				var article = action.notif.article;
				var createdBy = Utils.normalizeUser(article.createdBy);
				article.createdBy = createdBy;
			} else if(action.notif.highlight) {
				var highlight = action.highlight;
				var createdBy = Utils.normalizeUser(highlight.createdBy);
				highlight.createdBy = createdBy;
			}
			var notifTstamp = new Date(action.notif.createdAt).getTime()
			if (_lastViewed < notifTstamp) {
				_count++;
			}

			_notifs.unshift(action.notif);
			break;

		case Constants.NOTIFS_VIEWED:
			_count = 0;
			_lastViewed = new Date().getTime();
			break;

		default:
			return true;
	}
	
	NotificationStore.emitChange();
	return true;
})

module.exports = NotificationStore;
