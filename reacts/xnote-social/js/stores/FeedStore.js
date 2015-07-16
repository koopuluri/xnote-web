var GroupDispatcher = require('../dispatcher/GroupDispatcher');
var EventEmitter = require('events').EventEmitter;
var GroupConstants = require('../constants/Constants');
var Actions = require('../actions/GroupActions');
var _ = require('underscore');

var _feed = [];
var _index = 0;
var _lastAddedNoteId = null;
var _isLoading = false;
var _isLazy = true;

var CHANGE = 'feedStoreChange';

var SEG_SIZE = 6;

//Method to add a note to a post
function addNote(highlightId, note) {
		for(var i = 0; i < _feed.length; i++) {
				if(_feed[i].type === 'HighlightFeedPost') {
						if(_feed[i].highlight._id === highlightId) {
								_feed[i].highlight.notes.push(note);
						}
				}
		}
}


//Method to delete a note in a post
function deleteNote(note, highlightId) {
	for(var i = 0; i < _feed.length; i++) {
		if(_feed[i].type === 'HighlightFeedPost') {
			if(_feed[i].highlight._id === highlightId) {
				var notes = _feed[i].highlight.notes
				for(var j = 0; j < notes.length; j++) {
					if(notes[j].noteId === note.noteId) {
						notes.splice(j, 1);
					}
				}
			}
		}
	}
}

var FeedStore = _.extend({}, EventEmitter.prototype, {

    getIndex: function() {
        return _index;
    },

	//Return posts
	getFeed: function() {
		  return _feed;
	},

	isLazy: function() {
		return _isLazy;
	},

	getLoading: function() {
		return _isLoading;
	},

	//Emit Change event
	emitChange: function() {
		  this.emit(CHANGE);
	},

	//Add change listener
	addChangeListener: function(callback) {
		  this.on(CHANGE, callback);
	},

	removeChangeListener: function(callback) {
		  this.removeListener(CHANGE, callback);
	}
});

GroupDispatcher.register(function(payload) {
		var action = payload.action;

		switch(action.actionType) {
			case GroupConstants.SET_FEED:
				_feed = action.feed.reverse();
				break;

			case GroupConstants.SET_FEED_LOADING:
				_isLoading = action.isLoading;
				break;

			case GroupConstants.ADD_NOTE:
				addNote(action.highlightId, action.note);
				_lastAddedNoteId = action.note.noteId;
				break;

			case GroupConstants.EDIT_NOTE:
				editNote(action.note);
				break;

			case GroupConstants.DELETE_NOTE:
				deleteNote(action.note, action.highlightId);
				break;

			case GroupConstants.SOCKET_RECEIVE_POST:
				_feed.unshift(action.post);
				break;

			case GroupConstants.SOCKET_RECEIVE_NOTE:
				var noteId = action.note.noteId;
				if (! (_lastAddedNoteId && _lastAddedNoteId == noteId) ) {
					var toUpdate  = addNote(action.highlightId, action.note);
					if (toUpdate) {
							Actions.incrementFeedNotifs();
					}
					_lastAddedNoteId = noteId;
				} else {
					// do nothing. --> note already added, don't add again.
				}

				break;

			case GroupConstants.CLEAR_FEED:
				_index = 0;
				_feed = [];
				break;

			case GroupConstants.ADD_FEED_SEGMENT:
				var posts = action.feedPosts;
				if (posts) {
					_feed = _feed.concat(posts);
					_index += posts.length;
				}

				if (posts.length < SEG_SIZE) {
					_isLazy = false;
				}
				
				break;


			default:
				return true;
			}

		FeedStore.emitChange();
		return true;
});

module.exports = FeedStore;
