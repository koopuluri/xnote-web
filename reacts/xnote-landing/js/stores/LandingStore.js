var LandingDispatcher = require('../dispatcher/LandingDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var _ = require('underscore');

var _group = null;
var _loading = false;

var LandingStore = _.extend({}, EventEmitter.prototype, {
  
  	getGroup: function() {
        return _group;
    },

    getLoading: function() {
        return _loading;
    },
    
  	//emit change event
  	emitChange: function() {
  		this.emit('LandingChange');
  	},

  	//Add change listener
  	addChangeListener: function(callback) {
  		this.on('LandingChange', callback);
  	},

  	removeChangeListener: function(callback) {
  		this.removeListener('LandingChange', callback);
  	}
});

LandingDispatcher.register(function(payload) {

	  var action = payload.action;
	  switch(action.actionType) {

  	    case Constants.SET_GROUP:
    		    _group = action.group;
	  		    break;

        case Constants.SET_LOADING:
            _loading = action.isLoading;
            break;

	  	  default:
		   	    return true;
	
    }

	  LandingStore.emitChange();
	  return true;

});

module.exports = LandingStore;
