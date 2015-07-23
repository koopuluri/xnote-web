var keyMirror = require('react/lib/keyMirror');

// Define action constants
module.exports = keyMirror({

	SET_FEED: null,
	SET_FEED_LOADING: null,
	ADD_NOTE: null,
	EDIT_NOTE: null,
	DELETE_NOTE: null,
	SOCKET_RECEIVE_POST: null,
	SOCKET_RECEIVE_NOTE: null,
	CLEAR_FEED: null,
	ADD_FEED_SEGMENT: null,

    SET_GROUPS: null,
    SET_LOADING: null,
    SET_USER_INFO: null,
    SET_FRIENDS: null,
    ADD_GROUP: null,

    SET_CHAT_NOTIF_COUNT: null,
    SET_FEED_NOTIF_COUNT: null,
});
