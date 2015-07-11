var GroupDispatcher = require('../dispatcher/GroupDispatcher');
var EventEmitter = require('events').EventEmitter;
var GroupConstants = require('../constants/Constants');
var Actions = require('../actions/GroupActions');
var _ = require('underscore');

var _feed = [];
var _index = 0;

var CHANGE = 'feedStoreChange';

// got from: http://stackoverflow.com/a/5306832:
Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};

//Method to add a note to a post
function addNote(highlightId, note) {
		for(var i = 0; i < _feed.length; i++) {
				if(_feed[i].type === 'HighlightFeedPost') {
						if(_feed[i].highlight.highlightId === highlightId) {
								_feed[i].highlight.notes.unshift(note);

								// now need to put this post at the top:
								_feed.move(i, 0);
						}
				}
		}
}

//Method to edit a note in a post
function editNote(note) {
	for(var i = 0; i < _feed.length; i++) {
		if(_feed[i].type === 'HighlightFeedPost') {
			if(_feed[i].highlight.highlightId === note.highlightId) {
				var notes = _feed[i].highlight.notes
				for(var j = 0; j < notes.length; j++) {
					if(notes[j].noteId === note.noteId) {
						notes[j] = note;
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
			if(_feed[i].highlight.highlightId === note.highlightId) {
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
			  return _feed.slice(0, 3);
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

			case GroupConstants.ADD_NOTE:
				addNote(action.highlightId, action.note);
				break;

			case GroupConstants.EDIT_NOTE:
				editNote(action.note);
				break;

			case GroupConstants.DELETE_NOTE:
				deleteNote(action.note);
				break;

			case GroupConstants.SOCKET_RECEIVE_POST:
				_feed.unshift(action.post);
				break;

			case GroupConstants.SOCKET_RECEIVE_NOTE:
				var toUpdate  = addNote(action.highlightId, action.note);
				if (toUpdate) {
						Actions.incrementFeedNotifs();
				}
				break;

			case GroupConstants.RESET_SEGMENTS:
				_index = 0;
				_feed = _feed.slice(0, 5);
				break;


			case GroupConstants.ADD_FEED_SEGMENT:
			  var posts = action.feedPosts;
			  _feed = _feed.concat(posts);
			  _index += posts.length;
			  break;

				default:
					return true;
			}
		FeedStore.emitChange();
		return true;
});

module.exports = FeedStore;
