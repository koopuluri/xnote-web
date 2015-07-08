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

	RECEIVE_CHAT_NOTIFS: null,
	RECEIVE_FEED_NOTIFS: null,
	RESET_CHAT_NOTIFS: null,
	RESET_FEED_NOTIFS: null,

	SET_GROUP: null,
	SET_FEED: null,
	SET_ARTICLE_LIST: null,
	SET_USER: null,

	SET_DISC: null,
	SET_DISC_ERROR: null,
	SET_DISC_LOADING: null,

	SET_SELECTED_ARTICLE: null,
	SET_SELECTED_ARTICLE_ID: null,
	SET_HIGHLIGHT: null,
	SET_DISCUSSION_LOADING: null,
	ARTICLE_VIEW_ADD_NOTE: null,
	ARTICLE_VIEW_ADD_HIGHLIGHT: null,
	SET_DISCUSSION_LOADING: null,
	SET_DISCUSSION_HIGHLIGHT: null,

	SET_HOVER_HIGHLIGHT: null,
	SET_SELECT_PARTIAL_HIGHLIGHT: null,

	BASE_HIGHLIGHT_CLASS: "xnote-note",


	FEED_POST_ARTICLE: 'ArticleFeedPost',
	FEED_POST_HIGHLIGHT: 'HighlightFeedPost',

	RECEIVE_CHAT_NOTIFS: null,
	RECEIVE_FEED_NOTIFS: null,
	RESET_CHAT_NOTIFS: null,
	RESET_FEED_NOTIFS: null
});
