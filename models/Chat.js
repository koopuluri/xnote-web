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

var chatSchema = mongoose.Schema({
	group: {type: mongoose.Schema.Types.ObjectId, ref: 'Group'},
	createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	content: String,
	createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Chat', chatSchema);
