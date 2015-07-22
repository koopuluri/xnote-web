var mongoose = require('mongoose');


// allowed in schema:
// String
// Number
// Date
// Buffer
// Boolean
// Mixed
// ObjectId
// Array

var notifSchema = mongoose.Schema({
	createdAt: {type: Date, default: Date.now},
	
    group: {type: mongoose.Schema.Types.ObjectId, ref: 'Group'},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    
    forNote: Boolean,
    highlight:  {type: mongoose.Schema.Types.ObjectId, ref: 'Highlight'},
    article: {type: mongoose.Schema.Types.ObjectId, ref: 'Article'}
});

module.exports = mongoose.model('Notification', notifSchema);
