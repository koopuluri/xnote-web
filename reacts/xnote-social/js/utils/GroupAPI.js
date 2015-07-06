var GroupActions = require('../actions/GroupActions');

module.exports = {
	getGroupData: function() {
		var feed = JSON.parse(localStorage.getItem('feed'));
		GroupActions.fetchAndSetFeedForGroup(feed);
		var chat = JSON.parse(localStorage.getItem('chat'));
		GroupActions.fetchAndSetChatForGroup(chat);
	},

	receiveFeed: function(successCallback, errorCallback) {
		//TODO: Need to figure out a way to get groupId to this part
        $.get('/_feed_objects_for_group', {
            groupId: groupId
        }, function (data, status) {
            if (data.error) {
                errorCallback(data.error);
            } else {
                successCallback(data.feed);
            }
        });
    },


    // adds an article from url
    addNote: function(note, errorCallback) {
        $.post("/_add_note", {
        	note : note
        }, function(data, status) {
            if (data.error) {
                errorCallback(data.error);
            }
        });
    },

    editNote: function(note, errorCallback) {
    	$.post("/_edit_note", {
        	note : note
        }, function(data, status) {
            if (data.error) {
                errorCallback(data.error);
            }
        });
    },

    deleteNote: function(note, errorCallback) {
    	$.post("/_delete_note", {
        	note : note
        }, function(data, status) {
            if (data.error) {
                errorCallback(data.error);
            }
        });
    }
};
    


