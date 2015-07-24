var NOTE_SPAN_START_HTML = '<span class="note"';
var NOTE_SPAN_END_HTML = 'class="xnote-note-close"';

var mongoose = require('mongoose');

// utils object to deal with note stuffs:
var NoteUtils = {

		getTimestamp: function() {
			var _secondsToDate = function(seconds) {
				if (!seconds) {
					return '';
				}

				var d = new Date(seconds*1000); // The 0 there is the key, which sets the date to the epoch
				return '' + d;
			};

			var d = new Date();
			var t = d.getTime() / 1000;
			return _secondsToDate(t);

		},

		// used for new note / article creation: (http://stackoverflow.com/a/8809472)
		generateUUID: function() {
		    return mongoose.Types.ObjectId().toString();
		},

		_secondsToDate: function(seconds) {
			if (!seconds) {
					return '';
			}

			var d = new Date(seconds*1000); // The 0 there is the key, which sets the date to the epoch
			return '' + d;
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

module.exports = NoteUtils;
