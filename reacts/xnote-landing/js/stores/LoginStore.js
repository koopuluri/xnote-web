var LandingDispatcher = require('../dispatcher/LandingDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var _ = require('underscore');

var _error = '';

var CHANGE = 'LoginChange';

var LoginStore = _.extend({}, EventEmitter.prototype, {
  
  	getError: function() {
        return _error;
    },
    
  	//emit change event
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

LandingDispatcher.register(function(payload) {

	  var action = payload.action;
	  switch(action.actionType) {

  	    case Constants.SET_GROUP:
    		    _group = action.group;
	  		    break;

        case Constants.SET_LOADING:
            _loading = action.isLoading;
            break;

        case Constants.SET_ERROR:
            _error = action.error;
            break;

	  	  default:
		   	    return true;
	
    }

	  LoginStore.emitChange();
	  return true;

});

module.exports = LoginStore;
