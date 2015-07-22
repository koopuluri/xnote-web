module.exports = {

		notifsViewed: function(groupId, callback) {
			$.post('/_viewed_notifs', {
				groupId: groupId 
			})
		},

		getNotifs: function(groupId, callback) {
			$.get('/_notifs', {
				groupId: groupId
			}, function(data, status) {
				callback(data);
			});
		},

		getGroup: function(groupId, callback) {
			$.get('/_group', {
				groupId: groupId
			}, function(data, status) {
				callback(data);
			});
		},

		getArticle: function(articleId, callback) {
			$.get('/_article', {
					articleId: articleId
			}, function(data, status) {
					callback(data);
			});
		},

		getHighlight: function(highlightId, callback) {
			$.get('/_highlight', {
					highlightId: highlightId
			}, function(data, status) {
					callback(data);
			});
		},

		addHighlightForArticle: function(highlight, newSerialization, callback) {
			$.post('/_add_highlight', {
					highlight: highlight,
					serialization: newSerialization
			}, function(obj) {
					callback(obj);
			});
		},

		addNoteForHighlight: function(note, highlightId, callback) {
			$.post('/_add_note', {
					note: note,
					highlightId: highlightId
			}, function(obj) {
					callback(obj);
			});
		},

		getChatSegment: function(groupId, start, count, callback) {
			$.get('/_get_chat_segment', {
					groupId: groupId,
					start: start,
					count: count
			}, function(data, status) {
					callback(data);
			});
		},
		
		postChat: function(chat, groupId, callback) {
			$.post('/_add_chat', {chat: chat, groupId: groupId}, function(data, status) {
				callback(data);
			});
		},

		fetchChatNotifCount: function(groupId, callback) {
			$.get('/_get_chat_notif_count', 
				{groupId: groupId},
				function(data, status) {
					callback(data);
				});
		},

		clearChatNotifs: function(groupId, callback) {
			$.post('/_clear_chat_notifs', 
				{groupId: groupId}, 
				function(data, status) {
					callback(data);
				});
		}
};























