var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var XnoteConstants = require('../constants/Constants');
var _ = require('underscore');

// variables:
var CHANGE_EVENT = 'discussionChange';

// NOTE: _discussion corresponds to 'highlight' in the new schema.
// it is the entire highlight object ==> contains all of the highlights notes as well!
var _discussion = null;
var _isLoading = false;
var _isError = false;
var _lastAddedNoteId = null;

function setDiscussion(disc) {
    _discussion = disc;
}

function setLoading(isLoading) {
    _isLoading = isLoading;
}

function setError(isError) {
    _isError = isError;
}


function addNote(note) {
    _discussion.notes.unshift(note);
    _lastAddedNoteId = note.noteId;
}

function editNote(noteId, newNoteContent) {
    var notes = _discussion.notes;
    for (var i = 0; i < notes.length; i++) {
        if (notes[i].noteId == noteId) {
            // editing the content of this note:
            notes[i].content = newNoteContent;
        }
    }
}

var DiscussionStore = _.extend({}, EventEmitter.prototype, {
    getDiscussion: function() {
        return _discussion;
    },

    getLoading: function() {
        return _isLoading;
    },

    getLastAddedNoteId: function() {
        return _lastAddedNoteId;
    },

    getError: function() {
        return _isError;
    },

    // emitting change events:
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    // Remove change listener
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});


// Register callback with AppDispatcher
AppDispatcher.register(function(payload) {
  var action = payload.action;
  var text;

  switch(action.actionType) {

    case XnoteConstants.SET_DISC:
        setDiscussion(action.discussion);
        break;

    case XnoteConstants.SET_DISC_LOADING:
        setLoading(action.isLoading);
        break;

    case XnoteConstants.SET_DISC_ERROR:
        setError(action.isError);
        break;


    case XnoteConstants.NOTE_ADD:
        if (action.discussionId == _discussion.discussionId) {
            addNote(action.note);
        } else {
            console.log('the ids are not same: ' + action.discussionId + '; ' + _discussion.discussionId);
        }
        break;


    case XnoteConstants.NOTE_EDIT:
        if (action.discussionId == _discussion.discussionId) {
            editNote(action.noteId, action.newContent);
        } else {
            console.log('the ids are not same: ' + action.discussionId + '; ' + _discussion.discussionId);
        }
        break;

    default:
        return true;
  }

  // If action was responded to, emit change event
  DiscussionStore.emitChange();
  return true;

});

module.exports = DiscussionStore;
