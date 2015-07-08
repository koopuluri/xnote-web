var KeyMirror = require('react/lib/keyMirror');

//Define action constants
module.exports = KeyMirror({
	RECEIVE_CHAT: null,
	RECEIVE_FEED: null,
	ADD_NOTE: null,
	EDIT_NOTE: null,
	DELETE_NOTE: null,
	SET_VIEW_MODE: null,
	CHAT_MESSAGE: null,
	SIDEBAR_CHAT_VIEW: null,
	SIDEBAR_FEED_VIEW: null,

	SET_GROUP: null,
	SET_FEED: null,
	SET_ARTICLE_LIST: null,
	SET_USER: null,

	SET_DISC: null,
	SET_DISC_ERROR: null,
	SET_DISC_LOADING: null,

	FEED_POST_ARTICLE: 'ArticleFeedPost',
	FEED_POST_HIGHLIGHT: 'HighlightFeedPost'

});
