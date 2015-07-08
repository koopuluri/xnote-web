
module.exports = {

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
};
