var Dispatcher = require('../dispatcher/Dispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var Utils = require('../utils/NoteUtils');
var _ = require('underscore');

// variables:
var CHANGE_EVENT = 'discussionChange';

var SEG_SIZE = 6;

// NOTE: _discussion corresponds to 'highlight' in the new schema.
// it is the entire highlight object ==> contains all of the highlights notes as well!
var _highlight = null;
var _isLoading = false;
var _isError = false;
var _lastAddedNoteId = null;

function addNote(note) {
    var noteId = note.noteId;
    if (! (_lastAddedNoteId && _lastAddedNoteId == noteId) ) {
        _highlight.notes.push(note);
        _lastAddedNoteId = note.noteId;
    } else {
        // do nothing, note already there! 
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
Dispatcher.register(function(payload) {
  var action = payload.action;
  var text;

  switch(action.actionType) {

    case Constants.SET_DISCUSSION_HIGHLIGHT:
        var createdBy = Utils.normalizeUser(action.highlight.createdBy);
        action.highlight.createdBy = createdBy;
        _highlight = action.highlight;
        break;

    case Constants.SET_DISCUSSION_LOADING:
        _isLoading = action.isLoading;
        break;

    case Constants.SET_DISC_ERROR:
        _isError = action.isError;
        break;


    case Constants.DISCUSSION_ADD_NOTE:
        if (action.highlightId == _highlight._id) {
            var createdBy = Utils.normalizeUser(action.note.createdBy);
            action.note.createdBy = createdBy;
            addNote(action.note);
        } else {
            // do nothing.
        }
        break;

    case Constants.DISCUSSION_DELETE_NOTE:
        var highlightId = action.highlightId;
        var noteId = action.note.noteId;
        if (_highlight && _highlight._id === highlightId) {
            // delete the note;
            for (var i = 0; i < _highlight.notes.length; i++) {
                var note = _highlight.notes[i];
                if (note.noteId === noteId) {
                    // delete this note:
                    _highlight.notes.splice(i, 1);
                }
            }
        }
        break;

    case Constants.SOCKET_RECEIVE_NOTE:
        if (_highlight && action.highlightId === _highlight._id) {
            // time to add the note to this highlight:
            var createdBy = Utils.normalizeUser(action.note.createdBy);
            action.note.createdBy = createdBy;
            addNote(action.note);
        }
        break;

    case Constants.CLEAR_DISCUSSION: 
        _highlight = null;
        break;

    default:
        return true;
  }

  // If action was responded to, emit change event
  DiscussionStore.emitChange();
  return true;

});

module.exports = DiscussionStore;
