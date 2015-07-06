var GroupDispatcher = require('../dispatcher/GroupDispatcher');
var GroupConstants = require('../constants/GroupConstants');
var GroupUtils = require('../utils/GroupUtils');
var GroupAPI = require('../utils/GroupAPI');

//Define actions object
var GroupActions = {

	setUser: function(user, callback) {

	},

	fetchAndSetFeedForGroup: function(groupId) {
			GroupDispatcher.handleAction({
					actionType: GroupConstants.RECEIVE_FEED,
					data: data
			});
	},

	fetchAndSetChatForGroup: function(groupId) {
			GroupDispatcher.handleAction({
					actionType: GroupConstants.RECEIVE_CHAT,
					data: data
			});
	},

	addFeedObject: function(obj) {

	},

	addNote: function(highlightId, content) {
		var note = {
				//TODO: Get the current user and the ID
				createdBy: {
					name : 'Vignesh',
					id : 'qwerqwer'
				},

				createdAt: GroupUtils.getTimestamp(),
				content: content,
				noteId: GroupUtils.generateUUID(),
				highlightId: highlightId
		}

		GroupDispatcher.handleAction({
				actionType: GroupConstants.ADD_NOTE,
				note: note
		});
	},

	editNote: function(note, content) {
		note.content = content;
		GroupDispatcher.handleAction({
			actionType: GroupConstants.EDIT_NOTE,
			note: note
		});
	},

	deleteNote: function(note) {
		GroupDispatcher.handleAction({
			actionType: GroupConstants.DELETE_NOTE,
			note: note
		});

	},

	chat: function(content) {
		GroupDispatcher.handleAction({
			actionType: GroupConstants.CHAT_MESSAGE,
			content: content
		})
	},

	setViewMode: function(data) {
		GroupDispatcher.handleAction({
			actionType: GroupConstants.SET_VIEW_MODE,
			data: data
		})
	}
}

module.exports = GroupActions;
