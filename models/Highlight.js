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

var highlightSchema = mongoose.Schema({
    createdAt: {type: Date, default: Date.now},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    lastModifiedTimestamp: {type: Date, default: Date.now},
    highlightId: String,
    articleId: String,
    clippedText: String,
    notes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Note'}],
});

module.exports = mongoose.model('Highlight', highlightSchema);
