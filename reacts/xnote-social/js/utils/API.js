
module.exports = {

		getGroup: function(groupId, callback) {
				$.get('/_group', {
						groupId: groupId
				}, function(data, status) {
						callback(data);
				});
		},

		getArticle: function(articleId, callback) {
				console.log('getArticle!!!!: ' + articleId);
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

		addHighlightForArticle: function(highlight, callback) {
				$.post('/_add_highlight', {
						highlight: highlight
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
		}
};
















''
