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

		addArticleFromUrl: function(url, groupId, callback) {
			$.post('/_add_article_from_url', {
					groupId: groupId,
					url: url
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

		getFeedSegment: function(groupId, start, count, callback) {
			$.get('/_get_feed_segment', {
					groupId: groupId,
					start: start,
					count: count
			}, function(data, status) {
					callback(data);
			});
		},

		getArticleListSegment: function(groupId, start, count, callback) {
			$.get('/_get_article_list_segment', {
					groupId: groupId,
					start: start,
					count: count
			}, function(data, status) {
					callback(data);
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

		getFriends: function(callback) {
			$.get('/_friends', {}, function(data, status) {
				callback(data);
			});
		},

		addMembers: function(groupId, memberList, callback) {
			$.post('/_add_group_members', {
				members: memberList,
				groupId: groupId
			}, function(data, status) {
				callback(data);
			});
		},

		getUserInfo: function(callback) {
			$.get('/_user_info', {}, function(data, status) {
				callback(data);
			});
		},

		postChat: function(chat, groupId, callback) {
			$.post('/_add_chat', {chat: chat, groupId: groupId}, function(data, status) {
				callback(data);
			});
		}
};























