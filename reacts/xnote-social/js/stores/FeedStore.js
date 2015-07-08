var GroupDispatcher = require('../dispatcher/GroupDispatcher');
var EventEmitter = require('events').EventEmitter;
var GroupConstants = require('../constants/Constants');
var _ = require('underscore');

var _feed = [];
var CHANGE = 'feedStoreChange';



//Method to add a note to a post
function addNote(note) {
	for(var i = 0; i < _feed.length; i++) {
		if(_feed[i].type === 'HighlightFeedPost') {
			if(_feed[i].object.highlightId === note.highlightId) {
				_feed[i].object.notes.unshift(note);
			}
		}
	}
}

//Method to edit a note in a post
function editNote(note) {
	for(var i = 0; i < _feed.length; i++) {
		if(_feed[i].type === 'HighlightFeedPost') {
			if(_feed[i].object.highlightId === note.highlightId) {
				var notes = _feed[i].object.notes
				for(var j = 0; j < notes.length; j++) {
					if(notes[i].noteId === note.noteId) {
						notes[i] = note;
					}
				}
			}
		}
	}
}


//Method to delete a note in a post
function deleteNote(note) {
	for(var i = 0; i < _feed.length; i++) {
		if(_feed[i].type === 'HighlightFeedPost') {
			if(_feed[i].object.highlightId === note.highlightId) {
				var notes = _feed[i].object.notes
				for(var j = 0; j < notes.length; j++) {
					if(notes[i].noteId === note.noteId) {
						notes.splice(i, 1);
					}
				}
			}
		}
	}
}

var FeedStore = _.extend({}, EventEmitter.prototype, {

		//Return posts
		getFeed: function() {
				return _feed;
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
					_feed = action.feed;
					break;

			case GroupConstants.ADD_NOTE:
					addNote(action.note);
					break;

			case GroupConstants.EDIT_NOTE:
					editNote(action.note);
					break;

			case GroupConstants.DELETE_NOTE:
					deleteNote(action.note);
					break;

			default:
					return true;
		}
		FeedStore.emitChange();
		return true;
});

module.exports = FeedStore;
