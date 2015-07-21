var mongoose = require('mongoose');

// utils object to ease communication between front end and backend
var GroupUtils = {

	getUrlVars: function(url) {
	    var hash;
	    var myJson = {};
	    var hashes = url.slice(url.indexOf('?') + 1).split('&');
	    for (var i = 0; i < hashes.length; i++) {
	        hash = hashes[i].split('=');
	        myJson[hash[0]] = hash[1];
	    }
	    return myJson;
	},

	addHighlightToUrl: function(id) {
		var url = window.location.hash;
		var index = url.indexOf('&&');
		if (index >= 0) {
			// replace the existing highlight:
			window.location.hash = url.slice(0, index) + '&&highlightId=' + id;
			return;
		}

		// for when there's no already selected highlight id:
		window.location.hash = url +'&&highlightId=' + id;
	},	

	getTimestamp: function() {
		var d = new Date();
		var seconds = d.getTime();
		if (!seconds) {
			return '';
		}
		var date = new Date(seconds);
		return '' + date;
	},

	// used for new note / article creation: (http://stackoverflow.com/a/8809472)
	generateUUID: function() {
		return mongoose.Types.ObjectId().toString();
	},

	timeSince: function(date) {
		if (typeof date !== 'object') {
		    date = new Date(date);
		}

		var seconds = Math.floor((new Date() - date) / 1000);
		var intervalType;

		var interval = Math.floor(seconds / 31536000);
		if (interval >= 1) {
		    intervalType = 'year';
		} else {
		    interval = Math.floor(seconds / 2592000);
		    if (interval >= 1) {
		        intervalType = 'month';
		    } else {
		        interval = Math.floor(seconds / 86400);
		        if (interval >= 1) {
		            intervalType = 'day';
	            } else {
	         	    interval = Math.floor(seconds / 3600);
		            if (interval >= 1) {
		                intervalType = "hour";
		            } else {
		                interval = Math.floor(seconds / 60);
		                if (interval >= 1) {
		                    intervalType = "minute";
		                } else {
		                    interval = seconds;
	                        intervalType = "second";
	                    }
	                }
		        }
		    }
		}

	    if (interval > 1 || interval === 0) {
	        intervalType += 's';
	    }

		return interval + ' ' + intervalType;
	}
};

module.exports = GroupUtils;
