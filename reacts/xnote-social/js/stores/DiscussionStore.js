var AppDispatcher = require('../dispatcher/GroupDispatcher');
var EventEmitter = require('events').EventEmitter;
var XnoteConstants = require('../constants/Constants');
var _ = require('underscore');

// variables:
var CHANGE_EVENT = 'discussionChange';

// NOTE: _discussion corresponds to 'highlight' in the new schema.
// it is the entire highlight object ==> contains all of the highlights notes as well!
var _highlight = null;
var _isLoading = false;
var _isError = false;
var _lastAddedNoteId = null;

function addNote(note) {
    _highlight.notes.unshift(note);
    _lastAddedNoteId = note.noteId;
}

function editNote(noteId, newNoteContent) {
    var notes = _highlight.notes;
    for (var i = 0; i < notes.length; i++) {
        if (notes[i].noteId == noteId) {
            // editing the content of this note:
            notes[i].content = newNoteContent;
        }
    }
}

var DiscussionStore = _.extend({}, EventEmitter.prototype, {
    getHighlight: function() {
        return _highlight;
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

    case XnoteConstants.SET_DISCUSSION_HIGHLIGHT:
        _highlight = action.highlight;
        break;

    case XnoteConstants.SET_DISC_LOADING:
        _isLoading = action.isLoading;
        break;

    case XnoteConstants.SET_DISC_ERROR:
        _isError = action.isError;
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
