var AppDispatcher = require('../dispatcher/GroupDispatcher');
var EventEmitter = require('events').EventEmitter;
var XnoteConstants = require('../constants/Constants');
var Actions = require('../actions/ArticleActions');
var _ = require('underscore');

// variables:
var CHANGE_EVENT = 'partialHighlightChange';

var _selectedHighlightId = null;  // each group of highlight spans are associated with a dicussion id!
var _hoverHighlightId = null;

var PartialHighlightStore = _.extend({}, EventEmitter.prototype, {
    getSelectedHighlightId: function() {
        return _selectedHighlightId;
    },

    getHoverHighlightId: function() {
        return _hoverHighlightId;
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

    case XnoteConstants.SET_SELECT_PARTIAL_HIGHLIGHT:
        _selectedHighlightId = action.highlightId;
        break;

    case XnoteConstants.SET_HOVER_HIGHLIGHT:
        _hoverHighlightId = action.highlightId;
        break;

    default:
        return true;
  }

  // If action was responded to, emit change event
  PartialHighlightStore.emitChange();
  return true;

});

module.exports = PartialHighlightStore;
