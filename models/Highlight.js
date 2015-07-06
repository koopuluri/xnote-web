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
    groupId: String,
    clippedText: String,
    notes: [
        {
            createdBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            noteId: String,
            content: String,
            createdAt: {type: Date, default: Date.now},
        }
    ],
});

module.exports = mongoose.model('Highlight', highlightSchema);
