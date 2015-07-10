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

    case XnoteConstants.SET_DISCUSSION_LOADING:
        _isLoading = action.isLoading;
        break;

    case XnoteConstants.SET_DISC_ERROR:
        _isError = action.isError;
        break;


    case XnoteConstants.DISCUSSION_ADD_NOTE:
        if (action.highlightId == _highlight.highlightId) {
            addNote(action.note);
        } else {
            // do nothing.
            console.log('no note added in discStore.');
        }
        break;


    case XnoteConstants.SOCKET_RECEIVE_NOTE:
        if (_highlight && action.highlightId === _highlight.highlightId) {
            // time to add the note to this highlight:
            _highlight.notes.unshift(action.note);
            console.log('note added through socket to the discussion!');
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
